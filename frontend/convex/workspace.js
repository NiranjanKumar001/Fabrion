import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateWorkspace = mutation({
    args:{
        messages:v.any(),
        user:v.id('users')
    },
    handler:async(ctx,args)=>{
        const workspaceId=await ctx.db.insert('workspace',{
            messages:args.messages,
            user:args.user
        });
        return workspaceId;
    }
});

// //for fetching
// export const GetWorkspace = query({
//     args:{
//         workspaceId:v.id('workspace')
//     },
//     handler:async(ctx,args)=>{
//         const result=await ctx.db.get(args.workspaceId);
//         return result;
//     }
// })
//for updating
export const UpdateMessages=mutation({
    args:{
        workspaceId:v.id('workspace'),
        messages:v.any()
    },
    handler:async(ctx,args)=>{
        const result=await ctx.db.patch(args.workspaceId,{
            messages:args.messages
        });
        return result
    }
})
//for updating
export const UpdateFiles=mutation({
    args:{
        workspaceId:v.id('workspace'),
        files:v.any()
    },
    handler:async(ctx,args)=>{
        const result=await ctx.db.patch(args.workspaceId,{
            fileData:args.files
        });
        return result
    }
})
//for fetching
export const GetWorkspace = query({
    args:{
        workspaceId:v.id('workspace')
    },
    handler:async(ctx,args)=>{
        const result=await ctx.db.get(args.workspaceId);
        return result;
    }
})

export const GetAllWorkspace=query({
    args:{
        userId:v.id('users')

    },
    handler:async(ctx,db)=>{
        const result=await ctx.db.query('workspace')
        .filter(q=>q.eq(q.field('user'),args.userId))
        .collect();

        return result;
    }
})