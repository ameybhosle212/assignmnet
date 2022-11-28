import express from "express";
import env from 'dotenv'
import { graphqlHTTP } from "express-graphql"
import { graphql, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import pool from "./model/db";
import axios from "axios";
import { getUniqueListBy, helperFunc } from "./Helper";

env.config();
const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const youtubeDataType = new GraphQLObjectType({
    name: 'youtubeDatatype',
    fields: () => ({
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        url: { type: GraphQLString },
        published_date: { type: GraphQLString }
    })
})



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

const schema = new GraphQLSchema({ query: rootQuery, mutation: mutation })

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(1200, () => {
    console.log("SERVER AT 1200");

})