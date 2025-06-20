const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
<!DOCTYPE html>
<html>
<head>
    <title>YouTube Downloader - Working!</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
    <div class="text-center text-white p-8 max-w-2xl">
        <h1 class="text-6xl font-bold mb-8">✅ SUCCESS!</h1>
        <h2 class="text-4xl font-bold mb-8">YouTube Downloader</h2>
        <p class="text-xl mb-8">Beautiful interface is now running!</p>
        <div class="bg-white/10 p-8 rounded-3xl backdrop-blur-lg">
            <input 
                type="text" 
                placeholder="Paste YouTube URL here" 
                class="w-full p-4 rounded-xl bg-white/20 text-white placeholder-white/70 border-none outline-none mb-4"
            />
            <button class="w-full bg-red-600 hover:bg-red-700 p-4 rounded-xl font-bold text-white">
                Download Video - Server is Working!
            </button>
            <p class="text-sm mt-4 text-gray-300">Running on Node.js server - Port 8080</p>
        </div>
    </div>
</body>
</html>
  `);
});

server.listen(8080, () => {
  console.log('Server running at http://localhost:8080');
});
