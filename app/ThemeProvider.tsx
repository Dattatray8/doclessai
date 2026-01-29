'use client'

import { user } from "@/types/redux.types";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { theme } = useSelector((state: user) => state.user)
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);
    return (
        <>
            {children}
        </>
    )
}