import { Button, Frog, parseEther } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { erc1155Abi } from "../abis/erc1155Abi.js";
import { yumeEngineAbi } from "../abis/yumeEngienAbi.js";
import { contractTransaction, sendTransaction } from "frog/web";

export const app = new Frog({
  title: "Frog Frame",
  imageAspectRatio: "1:1",
  imageOptions: { width: 760, height: 760 },
});

app.transaction("/mintNft/:nftId", (c) => {
  const { nftId } = c.req.param();
  console.log("🚀 ~ app.transaction ~ nftId:", nftId);
  //   const { contractAddress, tokenId } = c.req.query();
  const { address } = c;
  console.log("🚀 ~ app.transaction ~ address:", address);
  const contractAddress = "0x996D9E03309993bCF6De9aE24464CD87626fA86f";
  const tokenId = "9";

  return c.contract({
    // contract: contractAddress,
    address: address,
    abi: yumeEngineAbi,
    functionName: "mintWithEth",
    args: [contractAddress, tokenId, address, 1, address, "0x"],
    value: BigInt(parseEther((0.0002).toString())),
    //@ts-ignore
    chainId: "eip155:111557560",
    to: contractAddress as `0x${string}`,
  });
});

app.frame("/mint/:nftId", (c) => {
  const { buttonValue, status } = c;
  const { nftId } = c.req.param();
  //   const { contractAddress, tokenId } = c.req.query();
  const contractAddress = "0x996D9E03309993bCF6De9aE24464CD87626fA86f";
  const tokenId = "9";
  const imageUrl =
    "https://fastly.picsum.photos/id/735/200/300.jpg?hmac=1a236E3f0SNOHOLEh3dxu5_WIFvWaNKYBSZXBWpi6xE";

  return c.res({
    image: (
      <div
        style={{
          color: "white",
          display: "flex",
          fontSize: 60,
          //   backgroundImage: `url(${imageUrl})`,
        }}
      >
        <img
          style={{
            objectFit: "contain",
            width: 760,
            height: 760,
          }}
          src={imageUrl}
        />
      </div>
    ),
    intents: [
      <Button.Transaction target={`/mintNft`}>
        Mint
      </Button.Transaction>,
    ],
  });
});

devtools(app, { serveStatic });
