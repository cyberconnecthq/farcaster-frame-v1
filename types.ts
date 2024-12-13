import { base, cyber, cyberTestnet, optimismSepolia } from "viem/chains";

export const isPrd = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

export const targetChainId = isPrd ? cyber.id : cyberTestnet.id;
export const selectedChainId = isPrd ? base.id : optimismSepolia.id;
