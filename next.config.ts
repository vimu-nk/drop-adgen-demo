// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // tighten if you know the CDN
      },
    ],
  },
};
