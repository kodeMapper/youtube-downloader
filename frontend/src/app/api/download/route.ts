import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const execAsync = promisify(exec);

interface DownloadRequest {
  url: string;
  infoOnly?: boolean;
}

// Validate YouTube URL
function isValidYouTubeUrl(url: string): boolean {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  return youtubeRegex.test(url);
}

// Clean filename for safe file system usage
function sanitizeFilename(filename: string): string {
  return filename.replace(/[^\w\s.-]/g, '').replace(/\s+/g, '_').trim();
}

// Create bulletproof Python downloader script
const createPythonDownloader = (url: string, outputDir: string) => `
import subprocess
import sys
import os
import time
import importlib.util

def install_package(package_name, upgrade=False):
    try:
        cmd = [sys.executable, "-m", "pip", "install"]
        if upgrade:
            cmd.append("--upgrade")
        cmd.extend([package_name, "--no-cache-dir", "--quiet"])
        subprocess.check_call(cmd, timeout=300)
        return True
    except:
        return False

def ensure_ytdlp():
    if importlib.util.find_spec("yt_dlp") is None:
        print("Installing yt-dlp...")
        if not install_package("yt-dlp"):
            raise Exception("Failed to install yt-dlp")
    else:
        # Try to upgrade yt-dlp
        install_package("yt-dlp", upgrade=True)

def download_video(url, output_dir):
    ensure_ytdlp()
    import yt_dlp
    
    user_agents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ]
    
    formats = ['best[height<=720]', 'best[height<=480]', 'best', 'worst']
    
    for format_selector in formats:
        for user_agent in user_agents:
            try:                ydl_opts = {
                    'format': format_selector,
                    'outtmpl': os.path.join(output_dir, '%(title)s.%(ext)s'),
                    'http_headers': {'User-Agent': user_agent},
                    'retries': 2,
                    'fragment_retries': 2,
                    'socket_timeout': 30,
                    'extractaudio': False,
                    'audioformat': 'mp3',
                    'restrictfilenames': True,
                    'noplaylist': True,
                    'ignoreerrors': False,
                    'quiet': True,
                    'no_warnings': True
                }
                
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    ydl.download([url])
                    return True
                    
            except Exception as e:
                print(f"Attempt failed: {str(e)}")
                continue
                
    raise Exception("All download attempts failed")

if __name__ == "__main__":
    try:
        download_video("${url}", "${outputDir}")
        print("SUCCESS")
    except Exception as e:
        print(f"ERROR: {str(e)}")
        sys.exit(1)
`;

export async function POST(request: NextRequest) {
  try {
    const body: DownloadRequest = await request.json();
    const { url, infoOnly = false } = body;

    // Validate input
    if (!url) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    if (!isValidYouTubeUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL format' },
        { status: 400 }
      );
    }

    // If infoOnly is true, just fetch video info without downloading
    if (infoOnly) {
      try {
        // Create temporary directory for info extraction
        const tempId = uuidv4();
        const tempDir = path.join(process.cwd(), 'temp', tempId);
        await fs.promises.mkdir(tempDir, { recursive: true });
        
        // Create a Python script to just extract info
        const pythonInfoCode = `
import sys
import os
import json
import importlib.util

def install_package(package_name):
    try:
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", package_name, "--quiet"])
        return True
    except:
        return False

if importlib.util.find_spec("yt_dlp") is None:
    print("Installing yt-dlp...")
    install_package("yt_dlp")

import yt_dlp

def get_video_info(url):
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        return {
            'title': info.get('title', 'Unknown Title'),
            'duration': info.get('duration', 0),
            'filesize': info.get('filesize', 0) or info.get('filesize_approx', 0),
            'thumbnail': info.get('thumbnail', ''),
            'formats': len(info.get('formats', [])),
            'channel': info.get('channel', 'Unknown Channel'),
            'upload_date': info.get('upload_date', ''),
            'view_count': info.get('view_count', 0),
        }

if __name__ == "__main__":
    try:
        info = get_video_info("${url}")
        print(json.dumps(info))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
`;
        
        const pythonInfoPath = path.join(tempDir, 'info_extractor.py');
        await fs.promises.writeFile(pythonInfoPath, pythonInfoCode);
        
        // Execute the Python info script
        const { stdout } = await execAsync(`python "${pythonInfoPath}"`, {
          timeout: 30000, // 30 second timeout
          cwd: tempDir
        });
        
        try {
          // Clean up temp dir
          await fs.promises.rm(tempDir, { recursive: true, force: true });
        } catch (cleanupError) {
          console.error('Info cleanup error:', cleanupError);
        }
        
        // Parse and return the video info
        const videoInfo = JSON.parse(stdout);
        return NextResponse.json(videoInfo);
      } catch (infoError) {
        console.error('Video info extraction error:', infoError);
        return NextResponse.json(
          { error: 'Failed to extract video information' },
          { status: 500 }
        );
      }
    }

    // Continue with regular download process
    // Create temporary directory for downloads
    const tempId = uuidv4();
    const tempDir = path.join(process.cwd(), 'temp', tempId);
    const pythonScript = path.join(tempDir, 'downloader.py');
    
    try {
      await fs.promises.mkdir(tempDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create temp directory:', error);
      return NextResponse.json(
        { error: 'Failed to create temporary directory' },
        { status: 500 }
      );
    }

    let videoPath: string;
    let videoTitle: string;

    try {
      // Create the Python downloader script
      const pythonCode = createPythonDownloader(url, tempDir.replace(/\\/g, '\\\\'));
      await fs.promises.writeFile(pythonScript, pythonCode);

      console.log('Executing bulletproof downloader...');
        // Execute the Python script with timeout
      const { stdout, stderr } = await execAsync(`python "${pythonScript}"`, {
        timeout: 45000, // 45 second timeout to stay within Vercel limits
        maxBuffer: 1024 * 1024 * 50, // 50MB buffer
        cwd: tempDir
      });

      console.log('Python stdout:', stdout);
      if (stderr) {
        console.log('Python stderr:', stderr);
      }

      if (!stdout.includes('SUCCESS')) {
        throw new Error(stderr || 'Download failed');
      }

      // Find the downloaded file
      const files = await fs.promises.readdir(tempDir);
      const videoFile = files.find(file => 
        (file.endsWith('.mp4') || 
         file.endsWith('.webm') || 
         file.endsWith('.mkv') ||
         file.endsWith('.mov') ||
         file.endsWith('.avi')) &&
        file !== 'downloader.py'
      );

      if (!videoFile) {
        throw new Error('No video file found after download');
      }

      videoPath = path.join(tempDir, videoFile);
      videoTitle = videoFile;

      // Check if file exists and has content
      const stats = await fs.promises.stat(videoPath);
      if (stats.size === 0) {
        throw new Error('Downloaded file is empty');
      }

      console.log(`Downloaded video: ${videoTitle} (${stats.size} bytes)`);

    } catch (downloadError) {
      console.error('Download error:', downloadError);
      
      // Clean up temp directory
      try {
        await fs.promises.rm(tempDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }

      const errorMessage = downloadError instanceof Error ? downloadError.message : 'Unknown download error';
      
      // Provide specific error messages for common issues
      if (errorMessage.includes('Video unavailable') || errorMessage.includes('Private video')) {
        return NextResponse.json(
          { error: 'Video is unavailable, private, or doesn\'t exist' },
          { status: 404 }
        );
      } else if (errorMessage.includes('age-restricted') || errorMessage.includes('Sign in to confirm')) {
        return NextResponse.json(
          { error: 'Video is age-restricted and cannot be downloaded' },
          { status: 403 }
        );
      } else if (errorMessage.includes('timeout')) {
        return NextResponse.json(
          { error: 'Download timeout - video may be too large or network is slow' },
          { status: 408 }
        );
      } else if (errorMessage.includes('geo')) {
        return NextResponse.json(
          { error: 'Video is geo-blocked in this region' },
          { status: 451 }
        );
      }

      return NextResponse.json(
        { error: `Download failed: ${errorMessage}` },
        { status: 500 }
      );
    }

    try {
      // Read the video file
      const videoBuffer = await fs.promises.readFile(videoPath);
      
      // Determine content type based on file extension
      const ext = path.extname(videoTitle).toLowerCase();
      const contentType = ext === '.webm' ? 'video/webm' : 
                         ext === '.mkv' ? 'video/x-matroska' :
                         ext === '.mov' ? 'video/quicktime' :
                         ext === '.avi' ? 'video/x-msvideo' :
                         'video/mp4';

      // Clean up temp directory (deferred for cleanup API)
      // We'll keep the file for a while and let the cleanup API handle it

      // Return the video file
      return new NextResponse(videoBuffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${sanitizeFilename(videoTitle)}"`,
          'Content-Length': videoBuffer.length.toString(),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
      });

    } catch (fileError) {
      console.error('File processing error:', fileError);
      
      // Clean up temp directory
      try {
        await fs.promises.rm(tempDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }

      return NextResponse.json(
        { error: 'Failed to process downloaded file' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle preflight OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
