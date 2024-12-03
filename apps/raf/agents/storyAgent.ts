import { createReactAgent } from "@langchain/langgraph/prebuilt";
import agentModel, { gameTools } from "./index.js";
import { SystemMessage } from "@langchain/core/messages";
import { STORY } from "./prompts/index.js";
import { MemorySaver } from "@langchain/langgraph";

const agentCheckpointer = new MemorySaver();

const agent = createReactAgent({
  llm: agentModel,
  tools: gameTools,
  checkpointSaver: agentCheckpointer,
  messageModifier: new SystemMessage(STORY),
});

export default agent;
