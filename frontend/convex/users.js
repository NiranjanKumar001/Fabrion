import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const CreateUser=mutation({
    args:{
        name:v.string(),
        email:v.string(),
        picture:v.string(),
        uid:v.string(),
    },
    handler:async(ctx,args)=>{
        //  here we will have all the condition that are there

        // user already exist
        const user=await ctx.db.query('users').filter((q)=>q.eq(q.field('email'),args.email)).collect()
        console.log(user)
        // not then use new user
        if(user?.length==0)
        {
            const result=await ctx.db.insert('users',{
                name:args?.name,
                picture:args?.picture,
                email:args?.email,
                uid:args?.uid,
            })
            console.log(result);
            
        }
    }
})