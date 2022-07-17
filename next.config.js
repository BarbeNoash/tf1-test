/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['photos.tf1.fr'],
  },
}

module.exports = nextConfig
