import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

// 상위 폴더(빌딩노트 랜딩)에 pnpm-lock.yaml이 있어 Next가 워크스페이스 루트를
// 잘못 추론하므로, 이 앱 폴더를 루트로 못박는다.
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: { root: projectRoot },
  outputFileTracingRoot: projectRoot,
};

export default nextConfig;
