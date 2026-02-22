'use client'

import {useSelector} from "react-redux";
import {user} from "@/types/redux.types";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {Edit, Trash} from "lucide-react";
import {AppType} from "@/types/global.types";

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
            setLoading(false);
            console.error(error.response.data);
            toast.error(error?.response?.data?.message || "Failed to fetch apps");
        } finally {
            setLoading(false);
        }
    }
    const deleteApp = async (id: string) => {
        try {
            if (!id) {
                toast.error('App not found');
                return;
            }
            const res = await axios.delete(`/api/v1/app/`, {
                params: {appId: id},
                withCredentials: true,
            })
            toast.success(res.data.message);
            await fetchApps();
        } catch (err: any) {
            console.error(err)
            toast.error(err?.response?.data?.message || "Failed to delete app");
        }
    }

    useEffect(() => {
        fetchApps();
    }, [userId]);

    return (
        <div className="flex flex-col gap-4" id="dashboard">
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
                            <th>Action</th>
                        </tr>
                        </thead>

                        <tbody>
                        {apps.map((app, index) => (
                            <tr key={app._id} className="hover">
                                <th>{index + 1}</th>
                                <td className="font-medium hover:underline hover:cursor-pointer"
                                    onClick={() => router.push(`/user/${userId}/app/${app._id}`)}>{app.name}</td>
                                <td className="max-w-md truncate">
                                    {app.description}
                                </td>
                                <td>
                                    {app.features?.length || 0}
                                </td>
                                <td>{app.contactEmail}</td>
                                <td className="flex gap-2"><Edit
                                    className="w-4 h-4 opacity-80 text-success hover:opacity-100 cursor-pointer"
                                    onClick={() => router.push(`/user/${userId}/app/${app._id}/edit`)}/>
                                    <Trash
                                        className="w-4 h-4 opacity-80 hover:opacity-100 cursor-pointer text-error"
                                        onClick={() => deleteApp(app._id)}/></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
