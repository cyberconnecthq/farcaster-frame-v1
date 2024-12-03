import { createReactAgent } from "@langchain/langgraph/prebuilt";
import agentModel, { mbtiTools } from "./index.js";
import { SystemMessage } from "@langchain/core/messages";
import { STORY2 } from "./prompts/index.js";
import { MemorySaver } from "@langchain/langgraph";

const agentCheckpointer = new MemorySaver();

const agent = createReactAgent({
  llm: agentModel,
  tools: mbtiTools,
  checkpointSaver: agentCheckpointer,
  messageModifier: new SystemMessage(STORY2),
});

export default agent;
