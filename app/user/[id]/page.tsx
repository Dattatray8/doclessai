'use client'

import { user } from "@/types/redux.types";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { useSelector } from "react-redux"

export default function Profile() {
    const data = useSelector((state: user) => state.user)
    console.log(data?.authUser?.image)
    return (
        <div className="card bg-base-300">
            <div className="card-body">
                <Pencil className="absolute right-6 cursor-pointer hover:text-accent transition-all" />
                <div className="flex sm:flex-row flex-col justify-center gap-6 items-center">
                    {data?.userData?.image || data?.authUser?.image ? (
                        <Image
                            src={data?.userData?.image || data?.authUser?.image}
                            width={100}
                            height={100}
                            alt="Profile Image"
                            title="Profile image"
                            className="rounded-full"
                            loading="eager"
                        />
                    ):(
                        <div className="rounded-full w-40 h-40 flex justify-center items-center text-5xl font-bold bg-base-100">
                            {data?.userData?.username[0]}
                        </div>
                    )}
                    <div className="text-2xl font-bold">{data?.userData?.username}</div>
                </div>
            </div>
        </div>
    )
}