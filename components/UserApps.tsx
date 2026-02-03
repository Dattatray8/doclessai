'use client'

import {useSelector} from "react-redux";
import {user} from "@/types/redux.types";
import {useRouter} from "next/navigation";

export default function UserApps() {
    const data = useSelector((state: user) => state.user)
    const router = useRouter();
    return (
        <div className="flex flex-col gap-4">
            <div className="p-2 flex justify-between">
                <p className="text-2xl font-semibold">My Apps</p>
                <button className="btn rounded-full btn-primary btn-outline"
                        onClick={() => router.push('/create-app')}>Create App
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Features</th>
                        <th>Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data?.userData.apps.length === 0 && (
                        <tr>
                            <th>1</th>
                            <td className="text-center sm:text-start md:pl-6 xl:pl-8">-</td>
                            <td className="text-center sm:text-start md:pl-6 xl:pl-8">-</td>
                            <td className="text-center sm:text-start md:pl-6 xl:pl-8">-</td>
                            <td className="text-center sm:text-start md:pl-6 xl:pl-8">-</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}