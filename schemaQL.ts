
export const typeDefs = `#graphql

    type User {
        id: ID!
        name: String!
        password: String!
        email: String!
        posts: [Post!]!
        comments: [Comment!]!
        likedPosts: [Post!]!
    }

    type Post {
        id: ID!
        content: String!
        author: User!
        comments: [Comment!]!
        likes: [User!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }

    type Query {
        users: [User!]!
        user(id: ID!): User
    }

    type Mutation {
        deleteUser(id: ID!): Boolean!
    }

`;