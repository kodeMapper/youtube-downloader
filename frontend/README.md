# 🎬 YouTube Downloader Web App

A modern, responsive Next.js web application for downloading YouTube videos using yt-dlp.

## ✨ Features

- 🚀 **Fast Downloads**: Optimized for speed and reliability
- 🎯 **High Quality**: Download videos in the best available quality  
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- 🎨 **Modern UI**: Beautiful gradient design with glassmorphism effects
- ⚡ **Real-time Progress**: Visual progress indicators during downloads
- 🛡️ **Error Handling**: Comprehensive error messages and validation
- 🔄 **Auto-cleanup**: Temporary files are automatically cleaned up

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Python 3.7+ (for yt-dlp)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd "YouTube Downloader/frontend"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Visit `http://localhost:3000`

### Easy Windows Start

For Windows users, simply double-click:
- `RUN-APP.bat` - One-click start
- `start-app.ps1` - PowerShell script with port detection

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Optional: Custom download timeout (default: 300000ms)
DOWNLOAD_TIMEOUT=300000

# Optional: Custom temp directory cleanup interval
CLEANUP_INTERVAL=3600000
```

### Next.js Configuration

The `next.config.js` is optimized for:
- React 19 compatibility
- YouTube image domains
- Webpack aliases for compatibility
- Vercel deployment

## 🌐 Deployment on Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=your-repo-url)

### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Environment Variables for Vercel

Set these in your Vercel dashboard:

```
NODE_ENV=production
API_TIMEOUT=300000
MAX_FILE_SIZE=104857600
DEFAULT_QUALITY=720
TEMP_DIR_CLEANUP_INTERVAL=3600000
```

## 🔍 API Endpoints

### POST `/api/download`
Downloads a YouTube video and returns the file as a binary response.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
- Success: Binary video file with appropriate headers
- Error: JSON error message with status code

### GET `/api/cleanup`
Cleans up temporary files older than 1 hour.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── download/route.ts    # Main download API
│   │   │   └── cleanup/route.ts     # Cleanup API
│   │   ├── globals.css              # Global styles
│   │   ├── layout.tsx               # Root layout
│   │   └── page.jsx                 # Main page
│   └── components/
│       └── DownloadForm/            # Reusable components
├── public/                          # Static assets
├── temp/                           # Temporary download files
├── package.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 🏗️ Architecture

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Elegant notifications

### Backend API
- **Next.js API Routes** - Serverless functions
- **Python Integration** - Bulletproof downloader logic
- **yt-dlp** - Robust YouTube downloading
- **File System Management** - Temporary file handling

### Deployment
- **Vercel** - Edge functions and global CDN
- **Automatic Cleanup** - Temporary file management
- **Environment Configuration** - Secure variable handling

## 🛡️ Bulletproof Features

### Download Resilience
- ✅ Multiple format fallbacks (`720p` → `480p` → `best` → `worst`)
- ✅ User-agent rotation (3 different browser signatures)
- ✅ Automatic retry mechanisms
- ✅ Network timeout handling
- ✅ Geo-blocking detection

### Error Handling
- ✅ Private/unavailable video detection
- ✅ Age-restriction handling
- ✅ Geo-blocking notifications
- ✅ Network error recovery
- ✅ Detailed error messages

### Performance
- ✅ Quality optimization for faster downloads
- ✅ Automatic cleanup of temporary files
- ✅ Memory-efficient streaming
- ✅ Vercel edge function optimization

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This tool is for educational and personal use only. Please respect YouTube's Terms of Service and copyright laws. Only download videos you have permission to download.

## 🆘 Support

- 📧 **Issues**: [GitHub Issues](your-repo-url/issues)
- 📖 **Documentation**: This README
- 🌟 **Star the repo** if you find it useful!

---

**Made with ❤️ for video enthusiasts**
