import { HumanMessage } from "@langchain/core/messages";
import { Button, FrameContext, TextInput } from "frog";
import { State } from "../src/types.js";
import agent from "../agents/styleAgent.js";

export const chatFrame = async (
  c: FrameContext<{
    State: State;
  }>
) => {
  const { buttonValue, inputText, deriveState } = c;

  let nftImage;
  const state = await deriveState(async (previousState) => {
    if (buttonValue === "start" || inputText) {
      try {
        const humanMessage =
          buttonValue === "start"
            ? new HumanMessage("Ok, let's start")
            : new HumanMessage(inputText!);
        if (buttonValue === "start") {
          previousState.threadId = new Date().getTime().toString();
        }
        const agentFinalState = await agent.invoke(
          { messages: [humanMessage] },
          { configurable: { thread_id: previousState.threadId } }
        );
        const content =
          agentFinalState.messages[agentFinalState.messages.length - 1].content;

        const toolMessage = agentFinalState.messages.find(
          (it: any) => it.name === "get_nft_image"
        );
        if (toolMessage) {
          console.log("tool messages content:", toolMessage.content);
          nftImage = toolMessage.content;
        }

        previousState.agentMsg = content;
      } catch (error) {
        console.error(error);
        previousState.agentMsg = "Sorry, I am not able to respond to that.";
      }
    }
  });

  console.log("nftImage:", nftImage);

  const wrapperStyle: any = {
    alignItems: "flex-end",
    display: "flex",
    height: 760,
    width: 760,
    backgroundSize: "100% 100%",
    backgroundImage:
      "url(https://c8dvsbhbfg9spccn.public.blob.vercel-storage.com/Hitman--t2B4vpcD6XuHw47wPQreg1bBqtnGuR.jpg)",
  };

  return c.res({
    image: (
      <div style={wrapperStyle}>
        <img
          src={"/accountant.png"}
          width={200}
          height={200}
          style={{
            marginBottom: "30px",
          }}
        />
        {!nftImage && (
          <div
            style={{
              color: "black",
              fontSize:
                state.agentMsg.length > 400
                  ? 16
                  : state.agentMsg.length > 250
                  ? 17
                  : 20,
              fontWeight: 500,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              padding: "15px",
              marginRight: "50px",
              whiteSpace: "pre-wrap",
              flex: "auto",
              borderRadius: "16px",
              marginBottom: "100px",
              display: "flex",
              transform: "translateX(-30px)",
              position: "relative",
            }}
          >
            {state.agentMsg}
            <img
              src="/bubble.png"
              style={{
                position: "absolute",
                left: "-6px",
                bottom: "-5px",
                width: "40px",
                height: "22px",
                opacity: "1",
              }}
            />
          </div>
        )}
        {nftImage && <img src={nftImage} width={456} height={456} />}
      </div>
    ),
    intents: [
      <TextInput placeholder="Your question/answer..." />,
      <Button value="send">Send</Button>,
    ],
  });
};
