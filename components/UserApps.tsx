'use client'

import {useSelector} from "react-redux";
import {user} from "@/types/redux.types";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import axios from "axios";
import toast from "react-hot-toast";

type AppType = {
    _id: string;
    name: string;
    description: string;
    features: any[];
    contactEmail: string;
};

export default function UserApps() {
    const data = useSelector((state: user) => state.user);
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);
    const [apps, setApps] = useState<AppType[]>([]);

    const userId = data?.userData?._id;

    const fetchApps = async () => {
            if (!userId) return;

            try {
                setLoading(true);
                const res = await axios.get(`/api/v1/app`, {
                    params: {userId: userId},
                    withCredentials: true,
                });
                setApps(res?.data?.apps || []);
            } catch
                (error: any) {
                console.error(error.response.data);
                toast.error(error?.response?.data?.message || "Failed to fetch apps");
            } finally {
                setLoading(false);
            }
        }
    ;

    useEffect(() => {
        fetchApps();
    }, [userId]);

    return (
        <div className="flex flex-col gap-4">
            <div className="p-2 flex justify-between items-center">
                <p className="text-2xl font-semibold">My Apps</p>
                <button
                    className="btn rounded-full btn-primary btn-outline"
                    onClick={() => router.push("/create-app")}
                >
                    Create App
                </button>
            </div>
            {loading && (
                <div className="p-6 text-center opacity-70">
                    Loading your apps...
                </div>
            )}
            {!loading && apps.length === 0 && (
                <div className="p-6 text-center opacity-70">
                    You haven’t created any apps yet.
                </div>
            )}
            {!loading && apps.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Features</th>
                            <th>Email</th>
                        </tr>
                        </thead>

                        <tbody>
                        {apps.map((app, index) => (
                            <tr key={app._id} className="hover">
                                <th>{index + 1}</th>
                                <td className="font-medium">{app.name}</td>
                                <td className="max-w-md truncate">
                                    {app.description}
                                </td>
                                <td>
                                    {app.features?.length || 0}
                                </td>
                                <td>{app.contactEmail}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
