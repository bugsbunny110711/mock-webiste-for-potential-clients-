import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Photographs at the sizes the shot list asks for run to a few megabytes,
      // and the 1MB default would reject them. The uploader enforces its own
      // 8MB cap before this one is reached, so the error is a readable message
      // rather than a framework rejection.
      bodySizeLimit: '9mb',
    },
  },
};

export default nextConfig;
