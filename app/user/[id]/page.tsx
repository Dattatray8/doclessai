'use client'

import { user } from "@/types/redux.types";
import { useSelector } from "react-redux"

export default function Profile() {
    const data = useSelector((state: user) => state.user)

    return (   
        <div>
            {data.userData?.username}
        </div>
    )
}