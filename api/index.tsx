import { config } from "dotenv";
config();

import { Button, Frog, parseEther } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { relayGateAbi } from "../abis/relayGateAbi.js";
import {
  getContactAddress,
  getCalldata,
  getNftInfo,
  getCrossMintFee,
} from "../server/service.js";
import { selectedChainId, targetChainId } from "../types.js";
import { handle } from "frog/next";
import { Address, formatEther } from "viem";

export const app = new Frog({
  title: "Frog Frame",
  imageAspectRatio: "1:1",
  basePath: "/api",
  imageOptions: { width: 760, height: 760 },
});

app.transaction("/mintNft/:nftId", async (c) => {
  const { nftId } = c.req.param();
  const { address } = c;
  const referAddress = c.req.query("refer");
  const refer =
    referAddress && referAddress != "undefined" ? referAddress : undefined;
  const data = await getNftInfo({
    id: nftId,
  });
  const nftPrice = Number(formatEther(BigInt(data.ethPrice || "0")));

  const res = await getCalldata({
    nftAddress: data.contract,
    tokenId: data.tokenId,
    address,
    refer: refer,
    selectedChain: selectedChainId,
    price: nftPrice,
  });

  const crossMintFee = await getCrossMintFee();

  const engineContractAddress = await getContactAddress({
    name: "contract_yume_engine",
    chainId: String(targetChainId),
  });
  const relayGateContractAddress = await getContactAddress({
    name: "contract_cyber_relay_gate_yume",
    chainId: String(targetChainId),
  });

  console.log("🚀 ~ app.transaction ~ contract params: ", [
    res.requestId,
    targetChainId,
    engineContractAddress,
    res.data,
  ]);
  return c.contract({
    abi: relayGateAbi,
    functionName: "relay",
    args: [res.requestId, targetChainId, engineContractAddress, res.data],
    chainId: `eip155:${selectedChainId}`,
    to: relayGateContractAddress as Address,
    value: BigInt(parseEther(nftPrice.toString())) + BigInt(crossMintFee),
  });
});

app.frame("/mint/:nftId", async (c) => {
  const { nftId } = c.req.param();
  const referral = c.req.query("refer");
  const referQuery = referral ? `?refer=${referral}` : "";
  const data = await getNftInfo({
    id: nftId,
  });

  return c.res({
    image: (
      <div
        style={{
          color: "white",
          display: "flex",
          fontSize: 60,
        }}
      >
        <img
          style={{
            objectFit: "contain",
            width: 760,
            height: 760,
          }}
          src={data.image}
        />
      </div>
    ),
    intents: [
      <Button.Transaction target={`/mintNft/${nftId}${referQuery}`}>
        Mint
      </Button.Transaction>,
      <Button.Link
        href={`${
          process.env.NEXT_PUBLIC_IRO_PUBLIC_SITE_URL as string
        }/mint/${nftId}`}
      >
        View on Iro
      </Button.Link>,
    ],
  });
});

if (import.meta.env?.MODE === "development") devtools(app, { serveStatic });
else devtools(app, { assetsPath: "/.frog" });

export const GET = handle(app);
export const POST = handle(app);
