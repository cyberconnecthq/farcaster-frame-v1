import { GraphQLClient, gql } from "graphql-request";

const API_ENDPOINT = "http://api.stg.cyberconnect.dev/yume/";

const client = new GraphQLClient(API_ENDPOINT, {
  headers: {
    "Content-Type": "application/json",
  },
});

const GENERATE_IMAGE_MUTATION = gql`
  mutation generateImage($prompt: String!, $modelId: String!) {
    generateImage(prompt: $prompt, modelId: $modelId)
  }
`;

// Define a function to send the request
export async function generateImage(prompt: string, modelId: string) {
  try {
    const variables = {
      prompt,
      modelId,
    };

    const response = await client.request(GENERATE_IMAGE_MUTATION, variables);
    return response;
  } catch (error) {
    console.error("Error:", error);
    // throw error;
  }
}
