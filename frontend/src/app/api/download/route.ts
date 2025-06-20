import { NextRequest, NextResponse } from 'next/server';

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

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: 'Could not extract video ID from URL' },
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

    // For actual download, redirect to external service
    // This approach works better on Vercel than trying to download directly
    const downloadServices = [
      `https://api.vevioz.com/api/button/mp4/${videoId}`,
      `https://www.y2mate.com/youtube/${videoId}`,
      `https://ytmp3.cc/youtube-to-mp4/${videoId}`
    ];

    return NextResponse.json({
      ...videoInfo,
      videoId: videoId,
      downloadUrl: downloadServices[0], // Primary service
      alternativeUrls: downloadServices.slice(1),
      message: 'Click the download link to download from external service',
      fallback: true
    });

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
