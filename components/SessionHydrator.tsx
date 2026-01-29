'use client'

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/userSlice";

export default function SessionHydrator() {
    const { data: session } = useSession();
    const dispatch = useDispatch();

    useEffect(() => {
        if (session?.user) {
            dispatch(setAuthUser(session.user));
        }
    }, [session, dispatch]);

    return null;
}
