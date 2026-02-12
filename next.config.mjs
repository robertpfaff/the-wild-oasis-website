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

export default nextConfig;