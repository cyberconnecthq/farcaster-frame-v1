import { Button, FrameContext } from "frog";
import { State } from "../src/types.js";

export const startFrame = async (
  c: FrameContext<{
    State: State;
  }>
) => {
  return c.res({
    action: "/conversation",
    image: (
      <div style={{ color: "white", display: "flex", fontSize: 60 }}>
        Start chatting to generate your RAF!
      </div>
    ),
    intents: [<Button value="Start">Start</Button>],
  });
};
