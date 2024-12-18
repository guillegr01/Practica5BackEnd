import { Collection } from "mongodb";
import { User, UserModel } from "./types.ts";
import { Post, PostModel } from "./types.ts";
import { Comment, CommentModel } from "./types.ts";

export const fromModelToUser = async (um: UserModel, uc: Collection<UserModel>, pc: Collection<PostModel>, cc: Collection<CommentModel>): Promise<User> => {
    
    const posts = await pc.find({ author: um._id }).toArray();
    
    const comments = await cc.find({ author: um._id }).toArray();

    return {
        id: um._id!.toString(),
        name: um.name,
        password: um.password,
        email: um.email,
        posts: await Promise.all(posts.map(pm => fromModelToPost(pm,uc, pc, cc))),
        comments: await Promise.all(comments.map(cm => fromModelToComment(cm, uc, pc, cc))),
        likedPosts: [] // Opcional: Implementar si necesario
    };
};

export const fromModelToPost = async (pm: PostModel, uc: Collection<UserModel>, pc: Collection<PostModel>, cc: Collection<CommentModel>): Promise<Post> => {
    
    const author = await uc.findOne({ _id: pm.author });
    
    const comments = await cc.find({ post: pm._id }).toArray();

    return {
        id: pm._id!.toString(),
        content: pm.content,
        author: author ? await fromModelToUser(author, uc, pc, cc) : undefined,
        comments: await Promise.all(comments.map(cm => fromModelToComment(cm, uc, pc, cc))),
        likes: [] // Opcional: Implementar si necesario
    };
};

export const fromModelToComment = async (cm: CommentModel, uc: Collection<UserModel>, pc: Collection<PostModel>, cc: Collection<CommentModel>): Promise<Comment> => {
    // Obtener autor del comentario
    const author = await uc.findOne({ _id: cm.author });
    // Obtener el post relacionado
    const post = await pc.findOne({ _id: cm.post });

    return {
        id: cm._id!.toString(),
        text: cm.text,
        author: author ? await fromModelToUser(author, uc, pc, cc) : null,
        post: post ? await fromModelToPost(post, uc, pc, cc) : null
    };
};