import { cyberTestnet, optimismSepolia } from "viem/chains";

export type NftInfo = {
  name: string;
  description: string;
  image: string;
  tokenId: string;
  chainId: string;
  contract: string;
  ethPrice: string;
  usdPrice: string;
};

export type State = {
  nftInfo: NftInfo;
};

export const targetChainId = cyberTestnet.id;
export const selectedChainId = optimismSepolia.id;
