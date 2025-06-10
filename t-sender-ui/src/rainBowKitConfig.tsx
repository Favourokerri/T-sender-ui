"use client";
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { anvil, zksync } from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_PROJECT_ID in environment variables");
}

export default getDefaultConfig({
  appName: 'Tsender',
  projectId, // ✅ Type is now `string`
  chains: [anvil, zksync],
  ssr: false,
});
