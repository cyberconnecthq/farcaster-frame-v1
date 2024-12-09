import { Button, Frog, parseEther } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { cyberTestnet, optimismSepolia } from "viem/chains";
import { relayGateAbi } from "../abis/relayGateAbi.js";
import {
  getContactAddress,
  getCalldata,
  getNftInfo,
  getCrossMintFee,
} from "../server/service.js";
import { State } from "../types.js";
import { handle } from "frog/next";

export const app = new Frog<{ State: State }>({
  title: "Frog Frame",
  imageAspectRatio: "1:1",
  basePath: "/",
  imageOptions: { width: 760, height: 760 },
  initialState: {
    nftInfo: {
      contract: "",
      tokenId: "",
      image: "",
      name: "",
      description: "",
      chainId: "",
      ethPrice: "",
      usdPrice: "",
    },
  },
});

const targetChainId = cyberTestnet.id;

app.transaction("/mintNft/:nftId", async (c) => {
  const { nftId } = c.req.param();
  const data = await getNftInfo({
    id: nftId,
  });
  const { address } = c;

  const res = await getCalldata({
    nftAddress: data.contract,
    tokenId: data.tokenId,
    address,
    refer: address,
    selectedChain: 11155420,
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
    chainId: `eip155:${optimismSepolia.id}`,
    to: relayGateContractAddress as `0x${string}`,
    value: BigInt(parseEther((0.0002).toString())) + BigInt(crossMintFee),
  });
});

app.frame("/mint/:nftId", async (c) => {
  const { nftId } = c.req.param();
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
      <Button.Transaction target={`/mintNft/${nftId}`}>
        Mint
      </Button.Transaction>,
      <Button.Link href={`https://stg.iro.xyz/mint/${nftId}`}>
        View on Iro
      </Button.Link>,
    ],
  });
});

if (import.meta.env?.MODE === "development") devtools(app, { serveStatic });
else devtools(app, { assetsPath: "/.frog" });

export const GET = handle(app);
export const POST = handle(app);
