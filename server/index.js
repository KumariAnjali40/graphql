const express = require('express');
const {ApolloServer}=require('@apollo/server');
const bodyParser = require('body-parser');
const cors = require('cors');
const {expressMiddleware} = require('@apollo/server/express4');
const { default: axios } = require('axios');
// const { graphqlPlayground } = require('graphql-playground-middleware-express');

async function startServer(){
    const app = express();
    const server = new ApolloServer({
        typeDefs:`

        type User {
            id: ID!,
            name: String!,
            username: String!
            email: String!
            phone:String
            website:String

        }
        type Todo {
            id:ID!
            title:String!
            completed:Boolean
        }
        
        type Query {
            getTodos:[Todo]
            getAllUsers: [User]
        }
        `,
        resolvers: {
            Query: {
               getTodos: async ()=>
                  (await  axios.get('https://jsonplaceholder.typicode.com/todos')).data,

                  getAllUsers: async ()=>
                  (await  axios.get('https://jsonplaceholder.typicode.com/users')).data,
            }
        },
    });

    app.use(bodyParser.json());
    app.use(cors());

    await server.start();

    app.use('/graphql',expressMiddleware(server));

    app.listen(4500,()=>{
        console.log("Server is started at 4500")
    })
}

startServer();