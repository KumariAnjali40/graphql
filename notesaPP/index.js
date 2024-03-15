const express=require('express');
const { connection } = require("./db");
const {userRouter}=require('./routes/user.routes');
// const jwt=require('jsonwebtoken');
const {noteRouter}=require('./routes/notes.routes');
const {UserModel}= require('./schema/user.model');
const {NoteModel}=require('./schema/note.model');

const { ApolloServer, gql } = require('apollo-server-express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {expressMiddleware} = require('@apollo/server/express4');
const { default: axios } = require('axios');


const typeDefs = gql`
    type User {
        _id: ID!
        name: String!
        email: String!
    }

    type Note {
        _id: ID!
        title: String!
        body: String!
        userID: ID!
        name: String!
    }

    type Query {
        users: [User]
        notes(userID: ID!): [Note]
    }

    type Mutation {
        createUser(name: String!, email: String!, pass: String!): User
        createNote(title: String!, body: String!, userID: ID!, name: String!): Note
    }
`;

// Define your resolver functions
const resolvers = {
    Query: {
        users: async () => await UserModel.find(),
        notes: async (_, { userID }) => await NoteModel.find({ userID })
    },
    Mutation: {
        createUser: async (_, { name, email, pass }) => {
            const user = new UserModel({ name, email, pass });
            await user.save();
            return user;
        },
        createNote: async (_, { title, body, userID, name }) => {
            const note = new NoteModel({ title, body, userID, name });
            await note.save();
            return note;
        }
    }
};

// Create an ApolloServer instance
const server = new ApolloServer({ typeDefs, resolvers });




const app=express();
// await server.applyMiddleware({ app });
app.use(express.json());




// app.use('/users',userRouter);
// app.use('/notes',noteRouter)



// app.listen(4500,async()=>{
//     try{
//        await connection
//        console.log("connected to db");
//        console.log("Server is running at port 4500");
//     }catch(err){
//         console.log(err);
//     }
    
// })

// Apply Apollo middleware
async function applyApolloMiddleware() {
    await server.start();
    server.applyMiddleware({ app });
}

// Apply Express middleware and start the server
async function startServer() {
    await applyApolloMiddleware();
    app.use('/users', userRouter);
    app.use('/notes', noteRouter);
    app.use('/graphql',expressMiddleware(server));
    
    app.listen(4500, async () => {
        try {
            await connection;
            console.log("Connected to db");
            console.log("Server is running at port 4500");
        } catch (err) {
            console.error(err);
        }
    });
}

startServer();