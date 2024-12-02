import { createReactAgent } from "@langchain/langgraph/prebuilt";
import agentModel, { styleTools } from "./index.js";
import { SystemMessage } from "@langchain/core/messages";
import { STORY3 } from "./prompts/index.js";
import { MemorySaver } from "@langchain/langgraph";

const agentCheckpointer = new MemorySaver();

const agent = createReactAgent({
  llm: agentModel,
  tools: styleTools,
  checkpointSaver: agentCheckpointer,
  messageModifier: new SystemMessage(STORY3),
});

export default agent;
