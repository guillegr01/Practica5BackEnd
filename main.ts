import { MongoClient } from "mongodb"
import { ApolloServer } from "npm:@apollo/server"
import { startStandaloneServer } from "npm:@apollo/server/standalone"

import { typeDefs } from "./schemaQL.ts";
import { CommentModel, PostModel, UserModel } from "./types.ts";
import { resolvers } from "./resolvers.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");

if(!MONGO_URL) {
  throw Error("Please enter a valid MONGO_URL");
}

const client = new MongoClient(MONGO_URL);
await client.connect();
console.info("Connected succesfully to DDBB");

const db = client.db("BBDD_P5");
const UserCollection = db.collection<UserModel>("users");
const PostCollection = db.collection<PostModel>("post");
const CommentCollection = db.collection<CommentModel>("comment");

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const { url } = await startStandaloneServer(server, {
  context: async () => ({uc:UserCollection, pc:PostCollection, cc:CommentCollection})
})

console.log(`🚀 Server runnig on: ${url}`);
