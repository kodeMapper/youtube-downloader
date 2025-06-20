"use client";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            YouTube Downloader
          </h1>
          <p className="text-xl mb-12 text-gray-300">
            Fast, reliable, and beautiful YouTube video downloader
          </p>
          
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-6">Enter YouTube URL</h2>
            <input 
              type="text" 
              placeholder="Paste your YouTube URL here"
              className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 mb-6 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 rounded-xl transition-all duration-300">
              Download Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
