"use client"

import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import React from 'react'

function CodeView() {
  return (
    <div>
      <SandpackProvider template="react">
        <SandpackLayout>
          <SandpackPreview />
          <SandpackCodeEditor />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  )
}

export default CodeView