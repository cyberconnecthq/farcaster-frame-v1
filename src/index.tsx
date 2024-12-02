import { Frog, parseEther } from "frog";
import { devtools } from "frog/dev";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { erc1155Abi } from "../abis/erc1155.js";
import { erc20Abi } from "../abis/erc20Abi.js";
import { startFrame } from "../frames/startFrame.js";
import { chatFrame } from "../frames/chatFrame.js";
import { State } from "./types.js";
import { mintFrame } from "../frames/mintFrame.js";
import { previewFrame } from "../frames/previewFrame.js";

export const app = new Frog<{ State: State }>({
  imageAspectRatio: "1:1",
  assetsPath: "/",
  basePath: "/",
  imageOptions: { height: 760, width: 760 },
  title: "Raf MafAI",
  initialState: {
    agentMsg:
      "Welcome to Raf MafAI! Let me ask you some questions to see what kind of Raf you are!",
    minted: false,
    prize: false,
    threadId: "",
  },
});

app.frame("/", startFrame);

app.frame("/chat", chatFrame);

app.frame("/preview", previewFrame);

app.frame("/mint", mintFrame);

app.transaction("/claim", (c) => {
  return c.contract({
    abi: erc20Abi,
    functionName: "mint",
    args: [c.address, parseEther("1000")],
    chainId: "eip155:11155111",
    to: "0xfA3429F6EbB01dfD9F1410DE6521e330983E90C1",
  });
});

app.transaction("/mint", (c) => {
  return c.contract({
    abi: erc1155Abi,
    functionName: "mint",
    args: [c.address, 1n, 1n, "0x"],
    chainId: "eip155:11155111",
    to: "0x46Cd434D643C3BafF7EED00c8206DF7269E5b073",
  });
});

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
