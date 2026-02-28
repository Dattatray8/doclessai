'use client'

import AppFeatures from "@/components/AppFeatures";
import { useEffect, useState } from "react";
import { AppType, Feature } from "@/types/global.types";
import axios from "axios";
import toast from "react-hot-toast";

export default function App({ params }: { params: { appId: string } }) {
    const [app, setApp] = useState<AppType | null>(null);
    const [features, setFeatures] = useState<Feature[]>([]);

    const fetchApp = async () => {
        const resolvedParams = await params;
        try {
            const res = await axios.get(`/api/v1/app`, { params: { appId: resolvedParams.appId }, withCredentials: true });
            console.log(res.data);
            setApp(res.data.app);
        } catch (err: any) {
            console.error(err.response.data);
            toast.error(err?.response?.data?.message || "Failed to fetch app");
        }
    }

    useEffect(() => {
        if (app) {
            setFeatures(app?.features.map((item: Feature) => ({
                name: item.name,
                description: item.description,
                route: item.route,
                image: item.image,
                elementId: item.elementId
            })));
        }
    }, [app])

    useEffect(() => {
        fetchApp();
    }, [])

    return (
        <div className="card">
            <div className="md:card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <p className="input w-full">{app?.name}</p>
                    <p className="input w-full">{app?.contactEmail}</p>
                </div>

                <p className="textarea w-full mt-4">{app?.description}</p>

                <div className="mt-5">
                    <AppFeatures featues={JSON.stringify(features, null, 2)} />
                </div>
            </div>
        </div>
    )
}