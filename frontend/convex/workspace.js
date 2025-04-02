import { v } from "convex/values";
import { mutation, query } from "./_generated/server";



export const CreateWorkspace = mutation({
    args: {
        messages: v.any(),
        user: v.id('users')
    },
    handler: async(ctx, args) => {
        const workspaceId = await ctx.db.insert('workspace', {
            messages: args.messages,
            user: args.user
        });
        return workspaceId;
    }
});

// Add API key to user
// export const UpdateApiKey = mutation({
//     args: {
//         userId: v.id('users'),
//         apiKey: v.string()
//     },
//     handler: async(ctx, args) => {
//         const result = await ctx.db.patch(args.userId, {
//             apiKey: args.apiKey
//         });
//         return result;
//     }
// });

export const UpdateApiKey = mutation({
    args: {
        userId: v.id('users'),
        apiKey: v.string(),
    },
    handler: async(ctx, args) => {
        // Create an update object
        const updateObj = {
            apiKey: args.apiKey
        };
        const result = await ctx.db.patch(args.userId, updateObj);
        return result;
    }
});

// // Get user with API key
// export const GetUserWithApiKey = query({
//     args: {
//         userId: v.id('users')
//     },
//     handler: async(ctx, args) => {
//         const user = await ctx.db.get(args.userId);
//         return user;
//     }
// });

// Get user with API key
export const GetUserWithApiKey = query({
    args: {
        userId: v.id('users') // Ensure this matches the expected input type
    },
    handler: async (ctx, args) => {
        // Check if userId is provided
        if (!args.userId) {
            throw new Error("Missing required field: userId");
        }

        // Fetch user from the database
        const user = await ctx.db.get(args.userId);

        // Check if the user exists
        if (!user) {
            throw new Error(`User with ID ${args.userId} not found`);
        }

        return user;
    }
});



export const UpdateMessages = mutation({
    args: {
        workspaceId: v.id('workspace'),
        messages: v.any()
    },
    handler: async(ctx, args) => {
        const result = await ctx.db.patch(args.workspaceId, {
            messages: args.messages
        });
        return result;
    }
});

export const UpdateFiles = mutation({
    args: {
        workspaceId: v.id('workspace'),
        files: v.any()
    },
    handler: async(ctx, args) => {
        const result = await ctx.db.patch(args.workspaceId, {
            fileData: args.files
        });
        return result;
    }
});

export const GetWorkspace = query({
    args: {
        workspaceId: v.id('workspace')
    },
    handler: async(ctx, args) => {
        const result = await ctx.db.get(args.workspaceId);
        return result;
    }
});

export const GetAllWorkspace = query({
    args: {
        userId: v.id('users')
    },
    handler: async(ctx, args) => {
        const result = await ctx.db.query('workspace')
        .filter(q => q.eq(q.field('user'), args.userId))
        .collect();
        return result;
    }
});

// Example Convex action
export const generateResponse = mutation({
    args: { prompt: v.string() },
    handler: async (ctx, args) => {
      // 1. Get user's API key
      const user = await ctx.db.get(ctx.user._id);
      const userApiKey = user?.apiKey || null;
  
      // 2. Create client with proper key
      const { chatSession } = createGeminiClient(userApiKey);
  
      // 3. Execute AI call
      const result = await chatSession.sendMessage(args.prompt);
      return result.response.text();
    }
  });