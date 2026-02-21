'use client'

import {Editor} from "@monaco-editor/react";
import {useSelector} from "react-redux";
import {user} from "@/types/redux.types";

export default function AppFeatures({featues}: { featues: string }) {
    const {theme} = useSelector((state: user) => state.user);

    return (
        <Editor
            height="300px"
            defaultLanguage="json"
            value={featues}
            theme={theme === "dark" ? "vs-dark" : "vs-light"}
            options={
                {readOnly: true}
            }
        />
    )
}