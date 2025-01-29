import { ObjectId, OptionalId } from "mongodb";

export type User = {
    id: string,
    name: string,
    email: string,
    posts: string[],
    comments: string[],
    likedPosts: string[]
}

export type Post = {
    id: string,
    content: string,
    author_id: string,
    comments: string[],
    likes: string[]
}

export type Comment = {
    id: string,
    text: string,
    author_id: string,
    post_id: string
}

export type UserModel = OptionalId<{
    name: string,
    email: string,
    posts: ObjectId[],
    comments: ObjectId[],
    likedPosts: ObjectId[]
}>;

export type PostModel = OptionalId<{
    content: string,
    author_id: ObjectId,
    comments: ObjectId[],
    likes: ObjectId[]
}>;

export type CommentModel = OptionalId<{
    text: string,
    author_id: ObjectId,
    post_id: ObjectId
}>;