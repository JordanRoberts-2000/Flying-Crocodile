import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:3000/graphql",
  documents: ["src/**/*.tsx", "!src/gql/**/*"],
  generates: {
    "./src/gql/": {
      preset: "client",
    },
  },
};

export default config;
