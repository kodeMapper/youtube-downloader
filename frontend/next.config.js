/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['i.ytimg.com', 'img.youtube.com'],
  },
  webpack: (config) => {
    // Ignore backup and legacy files
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/backup-legacy-files/**', '**/temp/**', '**/*.backup.*', '**/*.old.*']
    };
    return config;
  },
  typescript: {
    // Ignore TypeScript errors in backup files during build
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
