import { base, cyber, cyberTestnet, optimismSepolia } from "viem/chains";

export const isPrd = false;

export const targetChainId = isPrd ? cyber.id : cyberTestnet.id;
export const selectedChainId = isPrd ? base.id : optimismSepolia.id;
