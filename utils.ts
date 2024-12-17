import { Collection } from "mongodb";
import { User, UserModel } from "./types.ts";
import { Comment, CommentModel } from "./types.ts";
import { Post, PostModel } from "./types.ts";

export const fromModelToUser = async (um:UserModel, postCollection: Collection<PostModel>, commentCollection: Collection<CommentModel>): User => {
    const posts = await postCollection.find({ authorId: um._id }).toArray();
    return {
        id: um._id!.toString(),
        name: um.name,
        password: um.password,
        email: um.email,
        posts: posts.map((pm:PostModel) => {})
    }
};

/*
export interface User {
    id: string;
    name: string;
    password: string;
    email: string;
    posts: string[];       // IDs de las publicaciones
    comments: string[];    // IDs de los comentarios
    likedPosts: string[];  // IDs de las publicaciones con "like"
}

import { Collection } from "mongodb";
import { User, UserModel, Post } from "./types.ts";

export const fromModelToUser = async (
    um: UserModel,
    postCollection: Collection<Post>
): Promise<User> => {
    const posts = await postCollection.find({ authorId: um._id }).toArray();
    const comments = await postCollection.find({ "comments.authorId": um._id }).toArray();
    const likedPosts = await postCollection.find({ "likes.userId": um._id }).toArray();

    return {
        id: um._id!.toString(),
        name: um.name,
        password: um.password,
        email: um.email,
        posts: posts.map(post => post._id.toString()),
        comments: comments.map(comment => comment._id.toString()),
        likedPosts: likedPosts.map(like => like._id.toString())
    };
};

*/