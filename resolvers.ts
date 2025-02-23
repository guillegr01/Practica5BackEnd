import { Collection, ObjectId } from "mongodb";
import { CommentModel, PostModel, User, UserModel } from "./types.ts";
import { fromModelToUser } from "./utils.ts";
import { GraphQLError } from "graphql";

export const resolvers = {

    Query: {
        users: async (_root:unknown, _args:unknown, context: {uc:Collection<UserModel>,pc:Collection<PostModel>,cc:Collection<CommentModel>}): Promise<User[]> => {
            const usersDB = await context.uc.find().toArray();
            const users = Promise.all(usersDB.map((um)=>fromModelToUser(um, context.pc,context.cc)));
            return users;
        },
        user: async (_root:unknown, args: {id:string}, context:{uc:Collection<UserModel>,pc:Collection<PostModel>,cc:Collection<CommentModel>}): Promise<User|null> => {
            const userDb = await context.uc.findOne({_id: new ObjectId(args.id as string)});
            if(!userDb) return null;
            const user = fromModelToUser(userDb,context.pc, context.cc);
            return user;
        }
    },
    Mutation: {
        deleteUser: async (_root:unknown, args:{id:string}, context: {uc:Collection<UserModel>}): Promise<boolean> => {
            const { deletedCount } = await context.uc.deleteOne({
                _id: new ObjectId(args.id as string)
            });

            if(deletedCount===0) return false;
            else return true;
        }, 
        createUser: async (_root:unknown, args:{name:string,email:string}, context: {uc:Collection<UserModel>,pc:Collection<PostModel>,cc:Collection<CommentModel>}): Promise<User> => {
            const emailexists = await context.uc.findOne({email: args.email});
            if(emailexists) {
                throw new GraphQLError("email not valid, already in the DDBB");
            }

            const { insertedId } = await context.uc.insertOne({
                name: args.name,
                email: args.email,
                posts: [],
                comments: [],
                likedPosts: []
            });

            const newUserModel = {
                _id: insertedId,
                name: args.name,
                email: args.email,
                posts: [],
                comments: [],
                likedPosts: []
            }

            return fromModelToUser(newUserModel, context.pc, context.cc);

        }
    }
}