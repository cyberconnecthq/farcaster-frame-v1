import { Button, Frog, parseEther, TextInput } from "frog";
import { devtools } from "frog/dev";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { HumanMessage } from "@langchain/core/messages";
import { erc1155Abi } from "../abis/erc1155.js";
import { erc20Abi } from "../abis/erc20Abi.js";
import styleAgent from "../agents/styleAgent.js";

type State = {
  agentMsg: string;
  win: boolean;
  prize: boolean;
  threadId: string;
  gameStarted: boolean;
  giraffeRole: string;
};

export const app = new Frog<{ State: State }>({
  assetsPath: "/",
  basePath: "/raf",
  imageOptions: { height: 456, width: 760 },
  title: "Raf MafAI",
  initialState: {
    agentMsg:
      "Welcome to Raf MafAI! Let me ask you some questions to see what kind of Raf you are!",
    win: false,
    prize: false,
    threadId: "",
    gameStarted: false,
    giraffeRole: "",
  },
});

export const app2 = new Frog<{ State: State }>({
  assetsPath: "/",
  basePath: "/2",
  imageOptions: { height: 456, width: 760 },
  title: "Raf MafAI2",
  initialState: {
    agentMsg:
      "Welcome to Raf MafAI! Let me ask you some questions to see what kind of Raf you are!",
    win: false,
    prize: false,
    threadId: "",
    gameStarted: false,
    giraffeRole: "",
  },
});

app.frame("/gg", async (c) => {
  const {
    buttonValue,
    inputText,
    status,
    deriveState,
    previousState: pstate,
  } = c;

  const minted = pstate?.win;
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
        const agentFinalState = await styleAgent.invoke(
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
        if (content.includes("$RAF-")) {
          previousState.win = true;
          const giraffeRoleMatch = content.match(/\$RAF-[^.]+/);
          if (giraffeRoleMatch) {
            previousState.giraffeRole = giraffeRoleMatch[0];
          }
        }
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
    height: 456,
    width: 760,
    backgroundSize: "100% 100%",
    backgroundImage:
      "url(https://c8dvsbhbfg9spccn.public.blob.vercel-storage.com/Hitman--t2B4vpcD6XuHw47wPQreg1bBqtnGuR.jpg)",
  };

  return c.res({
    image: (
      <div style={wrapperStyle}>
        <img
          src={minted ? "/hitman.png" : "/accountant.png"}
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
      status !== "initial" && <Button value="send">Send</Button>,
      status === "initial" && <Button value="start">Let's start</Button>,
      state.win && !minted && (
        <Button.Transaction target="/mint">Mint Your RAF</Button.Transaction>
      ),
      minted && !state.gameStarted && (
        <Button value="startGame">Start Game</Button>
      ),
      minted && state.prize && (
        <Button.Transaction target="/claim">Claim Prize</Button.Transaction>
      ),
    ],
  });
});

app.frame("/style", async (c) => {
  const {
    buttonValue,
    inputText,
    status,
    deriveState,
    previousState: pstate,
  } = c;

  const minted = pstate?.win;
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
        const agentFinalState = await styleAgent.invoke(
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
        if (content.includes("$RAF-")) {
          previousState.win = true;
          const giraffeRoleMatch = content.match(/\$RAF-[^.]+/);
          if (giraffeRoleMatch) {
            previousState.giraffeRole = giraffeRoleMatch[0];
          }
        }
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
    height: 456,
    width: 760,
    backgroundSize: "100% 100%",
    backgroundImage:
      "url(https://c8dvsbhbfg9spccn.public.blob.vercel-storage.com/Hitman--t2B4vpcD6XuHw47wPQreg1bBqtnGuR.jpg)",
  };

  return c.res({
    image: (
      <div style={wrapperStyle}>
        <img
          src={minted ? "/hitman.png" : "/accountant.png"}
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
      status !== "initial" && <Button value="send">Send</Button>,
      status === "initial" && <Button value="start">Let's start</Button>,
      state.win && !minted && (
        <Button.Transaction target="/mint">Mint Your RAF</Button.Transaction>
      ),
      minted && !state.gameStarted && (
        <Button value="startGame">Start Game</Button>
      ),
      minted && state.prize && (
        <Button.Transaction target="/claim">Claim Prize</Button.Transaction>
      ),
    ],
  });
});

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
