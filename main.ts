import { MongoClient } from "mongodb";
import { UserModel, PostModel, CommentModel } from "./types.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");

if(!MONGO_URL) {
  throw new Error("Please provide a MONGO_URL");
}

const mongoClient = new MongoClient(MONGO_URL);
await mongoClient.connect();

console.info("Connected to MongoDB");

const mongoDB = mongoClient.db("BBDD_P5");
const UserCollection = mongoDB.collection<UserModel>("users");
const PostCollection = mongoDB.collection<PostModel>("post");
const CommentCollection = mongoDB.collection<CommentModel>("comment");