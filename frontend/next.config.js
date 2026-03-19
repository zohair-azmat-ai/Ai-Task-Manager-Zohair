/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // BACKEND_URL: set to your Hugging Face Spaces URL in Vercel env vars
    // Falls back to local FastAPI server for development
    const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
