import { ChatOpenAI } from "@langchain/openai";
import { generateImage } from "../server/image.js";
import { tool } from "@langchain/core/tools";

import dotenv from "dotenv";

dotenv.config();

const agentModel = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const getPrize = tool(
  (role: any) => {
    return `$RAF-${role}`;
  },
  {
    name: "get_nft",
    description:
      "Tells user what kind of NFT the user can mint after the user gets his/her giraffe role",
  }
);

const getPrize2 = tool(
  () => {
    return "$RAF";
  },
  {
    name: "get_prize",
    description:
      "Tells user what is the prize after the user guesses the murderer correctly",
  }
);

const getNftImage = tool(
  async (role) => {
    console.log("getNftImage, prompt:", role);
    const image = await generateImage(
      "giraffe," + role,
      "503871f0-9a22-43eb-8c9a-41a41fffd785"
    );
    console.log("image:", (image as any).generateImage);
    return (image as any).generateImage;
  },
  {
    name: "get_nft_image",
    description: "Tells user what kind of giraffe's appearance",
  }
);

const gameTools = [getPrize];
const mbtiTools = [getPrize2];
const styleTools = [getNftImage];

export { gameTools, mbtiTools, styleTools };

export default agentModel;
