'use client'

import { getUser } from "@/helpers/client/user";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function UserHydrator() {
    const dispatch = useDispatch();

    useEffect(() => {
        getUser(dispatch);
    }, [dispatch]);

    return null; 
}
