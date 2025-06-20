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

// Alternative approach using direct HTTP requests for video extraction
async function extractVideoInfo(url: string) {
  try {
    // Use a more lightweight approach to extract video information
    const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
    if (response.ok) {
      const data = await response.json();
      return {
        title: data.title || 'Unknown Title',
        author: data.author_name || 'Unknown Channel',
        thumbnail: data.thumbnail_url || '',
        duration: 0, // Not available in oembed
        success: true
      };
    }
    throw new Error('Failed to fetch video info');
  } catch (error) {
    console.error('Video info extraction failed:', error);
    return { success: false, error: 'Failed to extract video information' };
  }
}

// Create bulletproof Python downloader script with better error handling
const createPythonDownloader = (url: string, outputDir: string) => `
import subprocess
import sys
import os
import json
import time

def install_package(package_name, upgrade=False):
    try:
        cmd = [sys.executable, "-m", "pip", "install"]
        if upgrade:
            cmd.append("--upgrade")
        cmd.extend([package_name, "--no-cache-dir", "--quiet", "--user"])
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
        return result.returncode == 0
    except Exception as e:
        print(f"Install error: {e}")
        return False

def check_and_install_ytdlp():
    try:
        import yt_dlp
        print("yt-dlp already available")
        return True
    except ImportError:
        print("Installing yt-dlp...")
        if install_package("yt-dlp"):
            try:
                import yt_dlp
                return True
            except ImportError:
                return False
        return False

def download_with_ytdlp(url, output_dir):
    if not check_and_install_ytdlp():
        raise Exception("Failed to install or import yt-dlp")
    
    import yt_dlp
    
    # Multiple user agents and format options for better compatibility
    user_agents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ]
    
    # Start with lower quality formats for better compatibility on serverless
    formats = [
        'best[height<=480][ext=mp4]',
        'best[height<=720][ext=mp4]', 
        'best[ext=mp4]',
        'best[height<=480]',
        'best'
    ]
    
    last_error = None
    
    for format_selector in formats:
        for user_agent in user_agents:
            try:
                ydl_opts = {
                    'format': format_selector,
                    'outtmpl': os.path.join(output_dir, '%(title)s.%(ext)s'),
                    'http_headers': {'User-Agent': user_agent},
                    'retries': 1,
                    'fragment_retries': 1,
                    'socket_timeout': 20,
                    'restrictfilenames': True,
                    'noplaylist': True,
                    'ignoreerrors': False,
                    'quiet': True,
                    'no_warnings': True,
                    'extract_flat': False,
                    'prefer_ffmpeg': False
                }
                
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    # First try to extract info
                    info = ydl.extract_info(url, download=False)
                    if not info:
                        continue
                    
                    # Then download
                    ydl.download([url])
                    return True
                    
            except Exception as e:
                last_error = str(e)
                print(f"Attempt failed with format {format_selector}, UA {user_agent[:20]}...: {e}")
                time.sleep(1)  # Brief pause between attempts
                continue
    
    raise Exception(f"All download attempts failed. Last error: {last_error}")

if __name__ == "__main__":
    try:
        download_with_ytdlp("${url}", "${outputDir}")
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
    }    // If infoOnly is true, just fetch video info without downloading
    if (infoOnly) {
      const videoInfo = await extractVideoInfo(url);
      if (videoInfo.success) {
        return NextResponse.json(videoInfo);
      } else {
        return NextResponse.json(
          { error: videoInfo.error || 'Failed to extract video information' },
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
      await fs.promises.writeFile(pythonScript, pythonCode);      console.log('Executing bulletproof downloader...');
      
      // Execute the Python script with extended timeout and better error handling
      const { stdout, stderr } = await execAsync(`python3 "${pythonScript}" || python "${pythonScript}"`, {
        timeout: 50000, // 50 second timeout
        maxBuffer: 1024 * 1024 * 100, // 100MB buffer for larger videos
        cwd: tempDir,
        env: { ...process.env, PYTHONPATH: tempDir }
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
