import { GraphQLClient, gql } from "graphql-request";

// Define the GraphQL API endpoint
const API_ENDPOINT = "http://api.stg.cyberconnect.dev/yume/";

// Initialize the GraphQL client
const client = new GraphQLClient(API_ENDPOINT, {
  headers: {
    "Content-Type": "application/json",
  },
});

// Define the GraphQL mutation as a string
const GENERATE_IMAGE_MUTATION = gql`
  mutation generateImage($prompt: String!, $modelId: String) {
    generateImage(prompt: $prompt, modelId: $modelId)
  }
`;

// Define a function to send the request
export async function generateImage(prompt: string, modelId: string) {
  try {
    // Variables for the GraphQL mutation
    const variables = {
      prompt,
      modelId,
    };

    // Send the request using the client
    const response = await client.request(GENERATE_IMAGE_MUTATION, variables);
    return response;
  } catch (error) {
    console.error("Error:", error);
    // throw error;
  }
}

// // Example usage
// (async () => {
//   const prompt = "giraffe,wear blue jacket, red sun-glasses";
//   const modelId = "503871f0-9a22-43eb-8c9a-41a41fffd785";

//   try {
//     const result = await generateImage(prompt, modelId);
//     console.log("Generated image:", result);
//   } catch (error) {
//     console.error("Failed to generate image:", error);
//   }
// })();
