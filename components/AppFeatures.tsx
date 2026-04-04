'use client'

import {Editor} from "@monaco-editor/react";

export default function AppFeatures({featues}: { featues: string }) {

    return (
        <Editor
            height="300px"
            defaultLanguage="json"
            value={featues}
            theme={"vs-dark"}
            options={
                {readOnly: true}
            }
        />
    )
}