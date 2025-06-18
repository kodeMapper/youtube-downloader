import subprocess
import sys
import os
import time
import json
import urllib.request
import urllib.error
from pathlib import Path
import importlib.util

class BulletproofYouTubeDownloader:
    def __init__(self):
        self.downloads_folder = "downloads"
        self.max_retries = 3
        self.retry_delay = 5
        self.fallback_formats = ['best', 'worst', 'bestvideo+bestaudio', 'mp4']
        self.user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ]
        self.current_user_agent = 0
        
    def print_status(self, message, status="INFO"):
        """Print formatted status messages"""
        icons = {
            "INFO": "ℹ️",
            "SUCCESS": "✅",
            "ERROR": "❌",
            "WARNING": "⚠️",
            "PROGRESS": "🔄",
            "DOWNLOAD": "📥"
        }
        print(f"{icons.get(status, 'ℹ️')} {message}")
    
    def check_internet_connection(self):
        """Check if internet connection is available"""
        try:
            urllib.request.urlopen('https://www.google.com', timeout=5)
            return True
        except:
            return False
    
    def install_package(self, package_name, upgrade=False):
        """Install or upgrade a Python package with multiple attempts"""
        for attempt in range(self.max_retries):
            try:
                cmd = [sys.executable, "-m", "pip", "install"]
                if upgrade:
                    cmd.append("--upgrade")
                cmd.extend([package_name, "--no-cache-dir"])
                
                self.print_status(f"{'Upgrading' if upgrade else 'Installing'} {package_name} (attempt {attempt + 1})", "PROGRESS")
                
                result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
                
                if result.returncode == 0:
                    self.print_status(f"{package_name} {'upgraded' if upgrade else 'installed'} successfully", "SUCCESS")
                    return True
                else:
                    self.print_status(f"Attempt {attempt + 1} failed: {result.stderr}", "WARNING")
                    
            except subprocess.TimeoutExpired:
                self.print_status(f"Installation timeout on attempt {attempt + 1}", "WARNING")
            except Exception as e:
                self.print_status(f"Installation error on attempt {attempt + 1}: {str(e)}", "WARNING")
            
            if attempt < self.max_retries - 1:
                time.sleep(self.retry_delay)
        
        return False
    
    def ensure_dependencies(self):
        """Ensure all required dependencies are installed and updated"""
        self.print_status("Checking dependencies...", "PROGRESS")
        
        # Check internet connection
        if not self.check_internet_connection():
            self.print_status("No internet connection detected. Some features may not work.", "WARNING")
            return False
        
        required_packages = [
            ("yt-dlp", True),  # (package_name, should_upgrade)
            ("requests", True),
            ("urllib3", True)
        ]
        
        for package, should_upgrade in required_packages:
            # Check if package is already installed
            if importlib.util.find_spec(package.replace('-', '_')) is None:
                self.print_status(f"{package} not found, installing...", "INFO")
                if not self.install_package(package):
                    self.print_status(f"Failed to install {package}", "ERROR")
                    return False
            elif should_upgrade:
                # Always try to upgrade critical packages
                self.install_package(package, upgrade=True)
        
        return True
    
    def import_ytdlp(self):
        """Dynamically import yt-dlp with error handling"""
        try:
            import yt_dlp
            return yt_dlp
        except ImportError:
            self.print_status("yt-dlp import failed, attempting emergency installation...", "WARNING")
            if self.install_package("yt-dlp"):
                try:
                    import yt_dlp
                    return yt_dlp
                except ImportError:
                    self.print_status("Emergency installation failed", "ERROR")
                    return None
            return None
    
    def create_downloads_folder(self):
        """Create downloads folder with error handling"""
        try:
            Path(self.downloads_folder).mkdir(exist_ok=True)
            return True
        except Exception as e:
            self.print_status(f"Failed to create downloads folder: {str(e)}", "ERROR")
            # Try alternative folder
            self.downloads_folder = "temp_downloads"
            try:
                Path(self.downloads_folder).mkdir(exist_ok=True)
                self.print_status(f"Using alternative folder: {self.downloads_folder}", "WARNING")
                return True
            except:
                self.downloads_folder = "."  # Use current directory as last resort
                self.print_status("Using current directory for downloads", "WARNING")
                return True
    
    def get_video_info(self, yt_dlp, url):
        """Get video information with multiple fallback methods"""
        info_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': False,
            'http_headers': {
                'User-Agent': self.user_agents[self.current_user_agent]
            }
        }
        
        for attempt in range(len(self.user_agents)):
            try:
                with yt_dlp.YoutubeDL(info_opts) as ydl:
                    info = ydl.extract_info(url, download=False)
                    return info
            except Exception as e:
                self.print_status(f"Info extraction failed with User-Agent {attempt + 1}: {str(e)}", "WARNING")
                self.current_user_agent = (self.current_user_agent + 1) % len(self.user_agents)
                info_opts['http_headers']['User-Agent'] = self.user_agents[self.current_user_agent]
        
        return None
    
    def download_with_format(self, yt_dlp, url, format_selector):
        """Try downloading with a specific format"""
        ydl_opts = {
            'format': format_selector,
            'outtmpl': f'{self.downloads_folder}/%(title)s.%(ext)s',
            'http_headers': {
                'User-Agent': self.user_agents[self.current_user_agent]
            },
            'retries': 3,
            'fragment_retries': 3,
            'extractor_retries': 3,
            'ignoreerrors': False,
            'no_warnings': False
        }
        
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])
                return True
        except Exception as e:
            self.print_status(f"Download failed with format '{format_selector}': {str(e)}", "WARNING")
            return False
    
    def download_video(self, url):
        """Main download function with comprehensive error handling and fallbacks"""
        self.print_status(f"Starting download from: {url}", "DOWNLOAD")
        
        # Import yt-dlp dynamically
        yt_dlp = self.import_ytdlp()
        if not yt_dlp:
            self.print_status("Could not import yt-dlp. Please check your installation.", "ERROR")
            return False
        
        # Create downloads folder
        if not self.create_downloads_folder():
            return False
        
        # Get video information
        self.print_status("Extracting video information...", "PROGRESS")
        info = self.get_video_info(yt_dlp, url)
        
        if info:
            title = info.get('title', 'Unknown')
            duration = info.get('duration', 0)
            
            self.print_status(f"Video Title: {title}", "INFO")
            if duration:
                minutes, seconds = divmod(duration, 60)
                self.print_status(f"Duration: {minutes:02d}:{seconds:02d}", "INFO")
        else:
            self.print_status("Could not extract video info, but attempting download anyway...", "WARNING")
        
        # Try different formats with retries
        for format_selector in self.fallback_formats:
            self.print_status(f"Trying format: {format_selector}", "PROGRESS")
            
            for retry in range(self.max_retries):
                if retry > 0:
                    self.print_status(f"Retry {retry} for format '{format_selector}'", "PROGRESS")
                    time.sleep(self.retry_delay)
                
                if self.download_with_format(yt_dlp, url, format_selector):
                    self.print_status("Download completed successfully!", "SUCCESS")
                    self.print_status(f"Video saved in: {os.path.abspath(self.downloads_folder)}", "INFO")
                    return True
                
                # Rotate user agent for next attempt
                self.current_user_agent = (self.current_user_agent + 1) % len(self.user_agents)
        
        self.print_status("All download attempts failed", "ERROR")
        return False
    
    def validate_url(self, url):
        """Validate and clean YouTube URL"""
        if not url:
            return None
        
        # Clean URL - remove tracking parameters
        if '&' in url:
            url = url.split('&')[0]
        
        # Basic YouTube URL validation
        youtube_domains = ['youtube.com', 'youtu.be', 'm.youtube.com', 'www.youtube.com']
        if not any(domain in url.lower() for domain in youtube_domains):
            self.print_status(f"Warning: URL doesn't appear to be from YouTube: {url}", "WARNING")
        
        return url
    
    def run(self, urls):
        """Main execution function"""
        self.print_status("🚀 Bulletproof YouTube Downloader Started", "INFO")
        self.print_status("=" * 60, "INFO")
        
        # Ensure all dependencies are ready
        if not self.ensure_dependencies():
            self.print_status("Dependency check failed. Attempting to continue anyway...", "WARNING")
        
        if isinstance(urls, str):
            urls = [urls]
        
        successful_downloads = 0
        total_urls = len(urls)
        
        for i, url in enumerate(urls, 1):
            self.print_status(f"\n📥 Processing {i}/{total_urls}", "INFO")
            
            # Validate URL
            clean_url = self.validate_url(url)
            if not clean_url:
                self.print_status(f"Invalid URL: {url}", "ERROR")
                continue
            
            # Attempt download
            if self.download_video(clean_url):
                successful_downloads += 1
            else:
                self.print_status(f"Failed to download: {clean_url}", "ERROR")
            
            # Small delay between downloads to be respectful
            if i < total_urls:
                time.sleep(2)
        
        # Final summary
        self.print_status(f"\n🎉 Download session completed!", "SUCCESS")
        self.print_status(f"✅ Successful: {successful_downloads}/{total_urls}", "SUCCESS")
        if successful_downloads < total_urls:
            self.print_status(f"❌ Failed: {total_urls - successful_downloads}/{total_urls}", "ERROR")
        
        return successful_downloads == total_urls

def main():
    """Main function with emergency error handling"""
    try:
        downloader = BulletproofYouTubeDownloader()
        
        # URLs to download - modify this list as needed
        urls_to_download = [
            'https://youtube.com/shorts/HN1JAExrj1w?si=_fGefhEOxssUUDWZ'
        ]
        
        # Run the bulletproof downloader
        success = downloader.run(urls_to_download)
        
        if success:
            print("\n🎯 All downloads completed successfully!")
        else:
            print("\n⚠️ Some downloads failed. Check the logs above for details.")
            
    except KeyboardInterrupt:
        print("\n\n❌ Download interrupted by user")
    except Exception as e:
        print(f"\n💥 Unexpected error: {str(e)}")
        print("🔧 Please report this error if it persists")

if __name__ == "__main__":
    main()
