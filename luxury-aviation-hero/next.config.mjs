/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    })
    return config
  },
  // Allow connections from any IP
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
}

export default nextConfig