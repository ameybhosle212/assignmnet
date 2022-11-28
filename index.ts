import express from "express";
import env from 'dotenv'
import { graphqlHTTP } from "express-graphql"
import { graphql, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { helperFunc } from "./Helper";

// Environmental Variable
env.config();

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// DataType Schema 
const youtubeDataType = new GraphQLObjectType({
    name: 'youtubeDatatype',
    fields: () => ({
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        url: { type: GraphQLString },
        published_date: { type: GraphQLString }
    })
})


// Root Query for GraphQL
const rootQuery = new GraphQLObjectType({
    name: 'view',
    fields: {
        getUpdatedResult: {
            type: new GraphQLList(youtubeDataType),
            args: {
                value: { type: GraphQLString }
            },
            async resolve(parent, { value }) {
                return helperFunc(value)
            }
        }
    }
})


// Mutation for GraphQL
const mutation = new GraphQLObjectType({
    name: 'mutation',
    fields: {
        create: {
            type: youtubeDataType,
            args: {
                ll: { type: GraphQLInt }
            },
            resolve(parent, args) {
                return args;
            }
        }
    }
})

// Schema for GraphQL
const schema = new GraphQLSchema({ query: rootQuery, mutation: mutation })

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))


// Server at 1200
app.listen(1200, () => {
    console.log("SERVER AT 1200");

})