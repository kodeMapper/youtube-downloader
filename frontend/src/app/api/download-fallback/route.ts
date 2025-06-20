import { NextRequest, NextResponse } from 'next/server';

interface DownloadRequest {
  url: string;
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

export async function POST(request: NextRequest) {
  try {
    const body: DownloadRequest = await request.json();
    const { url } = body;

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

    // Use YouTube oEmbed API to get video information
    try {
      const oembedResponse = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
      
      if (!oembedResponse.ok) {
        throw new Error('Video not found or unavailable');
      }

      const videoInfo = await oembedResponse.json();
      
      // For the fallback route, we'll return video information and a download link
      // that uses a third-party service (this is a simplified approach)
      return NextResponse.json({
        title: videoInfo.title,
        author: videoInfo.author_name,
        thumbnail: videoInfo.thumbnail_url,
        videoId: videoId,
        downloadUrl: `https://api.vevioz.com/api/button/mp4/${videoId}`,
        message: 'Click the download link to download from external service',
        fallback: true
      });

    } catch (error) {
      console.error('Fallback download error:', error);
      
      return NextResponse.json(
        { 
          error: 'This video cannot be downloaded. It may be private, age-restricted, or geo-blocked.',
          suggestion: 'Try a different video or check if the URL is correct.'
        },
        { status: 404 }
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
      message: 'YouTube Download Fallback API',
      usage: 'POST with JSON body containing "url" field'
    }
  );
}
