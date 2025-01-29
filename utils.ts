import { Collection } from "mongodb";
import { Comment, CommentModel, Post, PostModel, User, UserModel } from "./types.ts";

export const fromModelToUser = async (um:UserModel, pc: Collection<PostModel>, cc: Collection<CommentModel>): Promise<User> => {
    const postsDB = await pc.find({author_id: um._id}).toArray();
    const commnetsDB = await cc.find({author_id: um._id}).toArray();
    const likedPostsDb = await pc.find({_id: {$in: um.likedPosts}}).toArray();

    return {
        id: um._id!.toString(),
        name: um.name,
        email: um.email,
        posts: postsDB.map((pm) => getPostModelID(pm)),
        comments: commnetsDB.map((cm) => getCommentModelID(cm)),
        likedPosts: likedPostsDb.map((pm) => getPostModelID(pm))
    }
}

export const fromModelToPost = async (pm:PostModel, uc:Collection<UserModel>, pc:Collection<PostModel>, cc: Collection<CommentModel>): Promise<Post> => {

    const userDb = await uc.findOne({_id: pm.author_id});
    const likesDb = await uc.find({_id: {$in: pm.likes}}).toArray();
    const commentsDb = await cc.find({post_id: pm._id}).toArray();

    if(!userDb) throw new Error("the author of the post does not exist");

    return {
        id: pm._id!.toString(),
        content: pm.content,
        author_id: userDb._id!.toString(),
        comments: commentsDb.map((cm)=>getCommentModelID(cm)),
        likes: likesDb.map((um)=>getUserModelID(um))
    }
}

export const fromModelToComment = async (cm:CommentModel, uc:Collection<UserModel>, pc:Collection<PostModel>): Promise<Comment> => {

    const userDb = await uc.findOne({_id: cm.author_id});
    const postDb = await pc.findOne({_id: cm.post_id});

    if(!userDb || !postDb) {
        throw new Error("The post or the author does not exist");
    }

    return {
        id: cm._id!.toString(),
        text:cm.text,
        author_id: userDb._id!.toString(),
        post_id: postDb._id!.toString(),
    }
}

const getUserModelID = (um:UserModel): string => {
    return um._id!.toString();
}

const getPostModelID = (pm:PostModel): string => {
    return pm._id!.toString();
}

const getCommentModelID = (cm:CommentModel): string => {
    return cm._id!.toString();
}