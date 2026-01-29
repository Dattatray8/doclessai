'use client'

import { user } from "@/types/redux.types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react"
import { useSelector } from "react-redux"

export default function User() {
    const router = useRouter();
    const data = useSelector((state: user) => state.user)
    const session = useSession();
    useEffect(() => {
        if (data.userData?.id || session?.data?.user) {
            router.replace(`/user/${session.data?.user.id}`)
        } else {
            router.replace('/login')
        }
    }, [data.userData, session, router])
}