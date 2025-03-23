import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const CreateWorkspace = mutation({
    args:{
        message:v.any(),
        user:v.id('users')
    },
    handler:async(ctx,args)=>{
        const workspaceId=await ctx.db.insert('workspace',{
            messages:args.message,
            user:args.user
        });
        return workspaceId;
    }
});
