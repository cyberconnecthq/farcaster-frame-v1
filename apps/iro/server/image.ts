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

