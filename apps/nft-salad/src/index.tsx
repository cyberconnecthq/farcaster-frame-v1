import { Button, Frog, parseEther } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { randomBytes } from "crypto";
import { yumeEngineAbi } from "../abis/yumeEngienAbi.js";

export const app = new Frog({
  title: "Frog Frame",
  imageAspectRatio: "1:1",
  imageOptions: { width: 760, height: 760 },
});

function generateRequestId(): string {
  return "0x" + randomBytes(32).toString("hex"); // Generates a 64-character hex string (32 bytes)
}

async function getCalldata({
  nftAddress,
  tokenId,
  address,
  refer,
  selectedChain,
}: {
  nftAddress: string;
  tokenId: string;
  address: string;
  refer: string;
  selectedChain: number;
}) {
  const vars = {
    input: {
      amount: 1,
      requestId: generateRequestId(),
      nft: nftAddress,
      tokenId: tokenId,
      to: address || "0x",
      price: parseEther((0.0002 * Number(1)).toString()).toString(),
      sourceChain: selectedChain,
      mintReferral: refer || "0x1F71D92A46Ab596ce22514A6f12C3D95cd51A30f", //it's our refer address
    },
  };
  const body = JSON.stringify({
    query: `
    mutation MintNftCalldata($input:MintNftCalldataInput!) {
        MintNftCalldata(input: $input) {
            status
            message
            data {
            requestId
            data
            }
        }
    }
    `,
    variables: vars,
  });
  console.log("🚀 ~ vars:", vars);
  const req = new Request("https://api.stg.cyberconnect.dev/yume/", {
    method: "POST",
    headers: {
      "Accept-Encoding": "gzip, deflate, br",
      "Content-Type": "application/json",
      Accept: "application/json",
      Connection: "keep-alive",
    },
    body: body,
  });
  const res = await fetch(req);
  console.log("🚀 ~ res:", res);
  const data = await res.json();
  console.log("🚀 ~ generated nft ~ data:", data);
  return data.data.MintNftCalldata.data;
}

app.transaction("/mintNft/:nftId", (c) => {
  const { nftId } = c.req.param();
  console.log("🚀 ~ app.transaction ~ nftId:", nftId);
  //   const { contractAddress, tokenId } = c.req.query();
  const { address } = c;
  console.log("🚀 ~ app.transaction ~ address:", address);
  const contractAddress = "0x996D9E03309993bCF6De9aE24464CD87626fA86f";
  const tokenId = "9";

  const result = await getCalldata({
    nftAddress: contractAddress,
    tokenId,
    address,
    refer: address,
    selectedChain: 11155420,
  });
  console.log("🚀 ~ app.transaction ~ result:", result.data);
  // const fee = await c.contract({
  //   address: "0xf4C06838561AC5855cb76040dbEAD23303612D91",
  // });

  return c.send({
    to: "0xf4C06838561AC5855cb76040dbEAD23303612D91",
    chainId: "eip155:11155420",
    data: result.data,
    // abi: abi,
    value: BigInt(parseEther((0.0002 * Number(1)).toString())),
  });
});

app.frame("/mint/:nftId", (c) => {
  const { buttonValue, status } = c;
  const { nftId } = c.req.param();
  // const { contractAddress, tokenId } = c.req.query();
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
      <Button.Transaction target={`/mintNft`}>Mint</Button.Transaction>,
    ],
  });
});

devtools(app, { serveStatic });
