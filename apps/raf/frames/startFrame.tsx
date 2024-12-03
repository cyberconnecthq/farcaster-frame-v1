import { Button, FrameContext } from "frog";
import { State } from "../src/types.js";

export const startFrame = async (
  c: FrameContext<{
    State: State;
  }>
) => {
  return c.res({
    action: "/chat",
    image: (
      <div
        style={{
          color: "black",
          display: "flex",
          fontSize: 40,
          backgroundColor: "white",
          width: "100%",
          height: "100%",
          "align-items": "center",
          "justify-items": "center",
          "text-align": "center",
        }}
      >
        Start chatting to generate your RAF!
      </div>
    ),
    intents: [<Button value="Start">Start</Button>],
  });
};
