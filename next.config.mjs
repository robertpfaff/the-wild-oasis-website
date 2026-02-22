
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  images: {
    qualities: [100, 50, 75, 80, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "swsduwfgaciylwefjsay.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/cabin-images/**",
      },
    ],
  }
};

export default {
  ...nextConfig,
  turbopack: {
    root: __dirname,
  },
};
