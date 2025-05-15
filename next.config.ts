import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
    output: "standalone",
    eslint: {
        ignoreDuringBuilds: true
    }
};

export default withFlowbiteReact(nextConfig);