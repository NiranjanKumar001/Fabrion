import { defineSchema, defineTable } from "convex/server"; 
import { v } from "convex/values";

//needs debugging so check over here

export default defineSchema({  
    users:defineTable({
        name:v.string(),
        email:v.string(),
        picture:v.string(),
        uid:v.string(), 
        apiKey: v.optional(v.string()),
    }),
    workspace:defineTable({
        messages:v.any(),//for json object
        fileData:v.optional(v.any()),
        user:v.id('users'),
    }),
});