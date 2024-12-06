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
