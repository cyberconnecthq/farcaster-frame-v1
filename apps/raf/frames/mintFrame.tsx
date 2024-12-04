import { Button, FrameContext } from "frog";
import { State } from "../src/types.js";
import { app } from "../src/index.js";
import { erc1155Abi } from "../abis/erc1155.js";

export const mintFrame = async (
  c: FrameContext<{
    State: State;
  }>
) => {
  return c.res({
    image: (
      <div style={{ color: "white", display: "flex", fontSize: 60 }}>
        Start chatting to generate your RAF!
      </div>
    ),
    intents: [<Button.Transaction target="/mint">mint</Button.Transaction>],
  });
};

app.transaction("/mint", (c) => {
  return c.contract({
    abi: erc1155Abi,
    functionName: "mint",
    args: [c.address, 1n, 1n, "0x"],
    chainId: "eip155:8453",
    to: "0xcF6d49c0196026A954D2261dF6eBdaA778BE4014",
  });
});
