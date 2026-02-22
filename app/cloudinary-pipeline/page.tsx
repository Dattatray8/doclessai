'use client'

import {useRef, useState} from "react";
import {cloudinaryPipeline} from "@/helpers/server/cloudinary";
import toast from "react-hot-toast";
import {Copy, Upload} from "lucide-react";
import Image from "next/image";

export default function CloudinaryPipelinePage() {
    const [cloudName, setCloudName] = useState<string>('');
    const [apiKey, setApiKey] = useState<string>('');
    const [apiSecret, setApiSecret] = useState<string>('');
    const [frontendImage, setFrontendImage] = useState("");
    const [backendImage, setBackendImage] = useState<File | null>();
    const imageRef = useRef<HTMLInputElement>(null);
    const [url, setUrl] = useState<string>('');

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) {
            return
        }
        setBackendImage(files[0])
        setFrontendImage(URL.createObjectURL(files[0]))
    }

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied to clipboard!");
        } catch (err: any) {
            toast.error("Failed to copy text: ");
            console.error("Failed to copy text: ", err);
        }
    };

    const handleConfigure = async () => {
        if (!backendImage) {
            toast.error("Please select an image");
            return;
        }

        const res = await cloudinaryPipeline(
            cloudName,
            apiKey,
            apiSecret,
            backendImage
        );
        if (!res?.success) {
            toast.error(res?.message || "Something went wrong");
            return;
        }

        setUrl(res.url)
        setFrontendImage("")
        setBackendImage(null)
    }

    return (
        <div className="flex flex-col gap-4">
            {url && (
                <div className={"input w-full flex justify-between"}>
                    <p className={"truncate max-w-56 sm:max-w-full"}>{url}</p>
                    <Copy className={"w-4 h-4 cursor-pointer opacity-80 hover:opacity-100"}
                          onClick={() => copyToClipboard(url)}/>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input className="input w-full" value={cloudName} onChange={(e) => setCloudName(e.target.value)}
                       placeholder="Enter cloud name"/>
                <input className="input w-full" value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                       placeholder="Enter api key"/>
                <input className="input w-full" value={apiSecret} onChange={(e) => setApiSecret(e.target.value)}
                       placeholder="Enter api secret"/>
            </div>
            <div className="w-full textarea h-80 lg:h-125 lg:w-[80%] flex self-center justify-center items-center">
                {!frontendImage && (
                    <div className="flex flex-col gap-2 items-center cursor-pointer"
                         onClick={() => imageRef.current?.click()}>
                        <input type="file" accept="image/*" hidden ref={imageRef} onChange={handleImage}/>
                        <Upload/>
                        <p>Upload Image</p>
                    </div>
                )}
                {frontendImage && (
                    <Image src={frontendImage} className="w-full h-full" alt="User image" width={100} height={100}/>
                )}
            </div>
            <button className={"btn btn-outline"} onClick={handleConfigure}>Get Image URL</button>
        </div>
    )
}