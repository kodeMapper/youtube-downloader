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

// Extract video ID from YouTube URL
function extractVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Get video info using YouTube oEmbed API
async function getVideoInfo(url: string) {
  try {
    const oembedResponse = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
    
    if (!oembedResponse.ok) {
      throw new Error('Video not found or unavailable');
    }

    const data = await oembedResponse.json();
    return {
      title: data.title || 'Unknown Title',
      author: data.author_name || 'Unknown Channel',
      thumbnail: data.thumbnail_url || '',
      duration: 0, // Not available in oembed
      success: true
    };
  } catch (error) {
    console.error('Video info extraction failed:', error);
    return { 
      success: false, 
      error: 'Failed to extract video information. Video may be private, age-restricted, or unavailable.' 
    };
  }
}

// Clean filename for safe file system usage
function sanitizeFilename(filename: string): string {
  return filename.replace(/[^\w\s.-]/g, '').replace(/\s+/g, '_').trim();
}

// Download video using yt-dlp in a simpler way
async function downloadVideoSimple(url: string, outputPath: string) {
  try {
    // First try to install yt-dlp if not available
    try {
      await execAsync('yt-dlp --version', { timeout: 5000 });
    } catch {
      console.log('Installing yt-dlp...');
      await execAsync('pip install yt-dlp --quiet', { timeout: 60000 });
    }

    // Use yt-dlp to download the video with simpler options
    const command = `yt-dlp --format "best[height<=720]/best" --output "${outputPath}/%(title)s.%(ext)s" --restrict-filenames --no-playlist "${url}"`;
    
    const { stdout, stderr } = await execAsync(command, {
      timeout: 120000, // 2 minute timeout
      maxBuffer: 1024 * 1024 * 200 // 200MB buffer
    });

    console.log('yt-dlp output:', stdout);
    if (stderr) console.log('yt-dlp stderr:', stderr);

    return true;
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
}

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

    // Get video information
    const videoInfo = await getVideoInfo(url);
    
    if (!videoInfo.success) {
      return NextResponse.json(
        { error: videoInfo.error },
        { status: 404 }
      );
    }

    if (infoOnly) {
      return NextResponse.json(videoInfo);
    }

    // For actual download, try to download the video
    const tempId = uuidv4();
    const tempDir = `/tmp/yt-downloads-${tempId}`;
    
    try {
      // Create temp directory
      await fs.promises.mkdir(tempDir, { recursive: true });
      
      // Download the video
      await downloadVideoSimple(url, tempDir);
      
      // Find the downloaded file
      const files = await fs.promises.readdir(tempDir);
      const videoFile = files.find(file => 
        file.endsWith('.mp4') || 
        file.endsWith('.webm') || 
        file.endsWith('.mkv') ||
        file.endsWith('.mov') ||
        file.endsWith('.avi')
      );

      if (!videoFile) {
        throw new Error('No video file found after download');
      }

      const videoPath = path.join(tempDir, videoFile);
      const stats = await fs.promises.stat(videoPath);
      
      if (stats.size === 0) {
        throw new Error('Downloaded file is empty');
      }

      // Read the video file
      const videoBuffer = await fs.promises.readFile(videoPath);
      
      // Clean up temp directory
      await fs.promises.rm(tempDir, { recursive: true, force: true });
      
      // Determine content type
      const ext = path.extname(videoFile).toLowerCase();
      const contentType = ext === '.webm' ? 'video/webm' : 
                         ext === '.mkv' ? 'video/x-matroska' :
                         ext === '.mov' ? 'video/quicktime' :
                         ext === '.avi' ? 'video/x-msvideo' :
                         'video/mp4';

      // Return the video file
      return new NextResponse(videoBuffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${sanitizeFilename(videoFile)}"`,
          'Content-Length': videoBuffer.length.toString(),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });

    } catch (downloadError) {
      console.error('Direct download failed:', downloadError);
      
      // Clean up on error
      try {
        await fs.promises.rm(tempDir, { recursive: true, force: true });
      } catch {}

      // Fallback to external service
      const videoId = extractVideoId(url);
      if (videoId) {
        return NextResponse.json({
          ...videoInfo,
          videoId: videoId,
          downloadUrl: `https://www.y2mate.com/youtube/${videoId}`,
          message: 'Direct download failed. Using external service.',
          fallback: true,
          error: 'Direct download not available on this platform'
        });
      }

      return NextResponse.json(
        { error: 'Download failed and no fallback available' },
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

export async function GET() {
  return NextResponse.json(
    { 
      message: 'YouTube Download API',
      usage: 'POST with JSON body containing "url" and optional "infoOnly" fields',
      status: 'active'
    }
  );
}

// Handle preflight OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
