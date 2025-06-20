export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h2 className="text-4xl font-bold mb-4">404</h2>
      <p className="text-xl mb-6">Page Not Found</p>
      <a
        href="/"
        className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
      >
        Return Home
      </a>
    </div>
  );
}
