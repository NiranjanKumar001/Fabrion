"use client";

import React from 'react'
import { ConvexProvider, ConvexReactClient } from "convex/react";

function ConvexClientProvider({ children }) {

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://dummy.convex.cloud";
    const convex = new ConvexReactClient(convexUrl);

    return (
        <ConvexProvider client={convex}>{children}</ConvexProvider>
    )
}

export default ConvexClientProvider