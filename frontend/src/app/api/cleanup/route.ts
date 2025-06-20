import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const tempDir = path.join(process.cwd(), 'temp');
    
    // Check if temp directory exists
    if (!fs.existsSync(tempDir)) {
      return NextResponse.json({ message: 'No temp directory found' });
    }

    const now = Date.now();
    const maxAge = 1000 * 60 * 60; // 1 hour in milliseconds
    let cleanedFiles = 0;
    let cleanedDirs = 0;

    // Read all subdirectories in temp
    const entries = await fs.promises.readdir(tempDir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const dirPath = path.join(tempDir, entry.name);
        
        try {
          const stats = await fs.promises.stat(dirPath);
          const age = now - stats.mtimeMs;
          
          // Remove directories older than 1 hour
          if (age > maxAge) {
            await fs.promises.rm(dirPath, { recursive: true, force: true });
            cleanedDirs++;
          }
        } catch (error) {
          console.error(`Error processing directory ${dirPath}:`, error);
          // Try to remove it anyway
          try {
            await fs.promises.rm(dirPath, { recursive: true, force: true });
            cleanedDirs++;
          } catch (removeError) {
            console.error(`Failed to remove directory ${dirPath}:`, removeError);
          }
        }
      } else {
        // Clean up individual files too
        const filePath = path.join(tempDir, entry.name);
        
        try {
          const stats = await fs.promises.stat(filePath);
          const age = now - stats.mtimeMs;
          
          if (age > maxAge) {
            await fs.promises.unlink(filePath);
            cleanedFiles++;
          }
        } catch (error) {
          console.error(`Error processing file ${filePath}:`, error);
        }
      }
    }

    return NextResponse.json({
      message: 'Cleanup completed',
      cleanedFiles,
      cleanedDirs,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { error: 'Cleanup failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Allow POST as well for manual cleanup triggers
export async function POST() {
  return GET();
}
