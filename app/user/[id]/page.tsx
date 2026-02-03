'use client'

import { setUserData } from "@/redux/userSlice";
import { user } from "@/types/redux.types";
import axios from "axios";
import { Camera, Pencil, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux"

export default function Profile() {
    const data = useSelector((state: user) => state.user)
    const [edit, setEdit] = useState<boolean>(false);
    const [userName, setUserName] = useState("")
    const [frontendImage, setFrontendImage] = useState("");
    const [backendImage, setBackendImage] = useState<File>();
    const imageRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const Icon = edit ? X : Pencil
    useEffect(() => {
        if (data?.userData) {
            setUserName(data?.userData?.username as string);
            setFrontendImage(data?.userData?.image as string)
        }
    }, [data?.userData])

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) {
            return
        }
        setBackendImage(files[0])
        setFrontendImage(URL.createObjectURL(files[0]))
    }

    const handleEdit = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", userName)
            if (backendImage) {
                formData.append("file", backendImage!);
            }
            const res = await axios.put('/api/v1/user', formData, { withCredentials: true })
            dispatch(setUserData(res?.data.user))
            toast.success(res?.data.message)
            setEdit(false);
            setLoading(false);
        } catch (error: any) {
            setEdit(false);
            toast.error(error.response.data.message)
            console.log(error);
        } finally {
            setEdit(false);
            setLoading(false);
        }
    }

    return (
        <div className="card bg-base-300">
            <div className="card-body">
                <Icon className="absolute right-6 cursor-pointer hover:text-accent transition-all" onClick={() => setEdit(!edit)} />
                {!edit && (
                    <div className="flex sm:flex-row flex-col justify-center gap-6 items-center">
                        {data?.userData?.image || data?.authUser?.image ? (
                            <div className="avatar">
                                <div className="w-24 rounded-full">
                                    <Image src={data.userData?.image || data?.authUser?.image} alt="userImg" className="rounded-full" style={{ width: 100, height: 100 }} width={100} height={100} loading="eager" />
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-full w-40 h-40 flex justify-center items-center shadow-md text-5xl font-bold bg-base-100">
                                {data?.userData?.username[0]}
                            </div>
                        )}
                        <div className="text-2xl font-bold">{data?.userData?.username}</div>
                    </div>
                )}
                {edit && (
                    <div className="flex sm:flex-row flex-col justify-center gap-6 items-center">
                        {data?.userData?.image || data?.authUser?.image ? (
                            <div className="relative flex justify-center items-center" onClick={() => imageRef.current?.click()}>
                                <Camera className="absolute cursor-pointer" size={50} />
                                <input type="file" accept="image/*" hidden ref={imageRef} onChange={handleImage} />
                                <Image
                                    src={frontendImage || data?.userData?.image || data?.authUser?.image}
                                    width={100}
                                    height={100}
                                    alt="Profile Image"
                                    title="Profile image"
                                    className="rounded-full shadow-md cursor-pointer"
                                    loading="eager"
                                    style={{ width: 100, height: 100 }}
                                />
                            </div>
                        ) : (
                            !frontendImage ? (
                                <div className="rounded-full w-40 h-40 flex cursor-pointer transition-all justify-center items-center shadow-md text-5xl font-bold opacity-60" style={{ backgroundColor: '#00000070' }} onClick={() => imageRef.current?.click()}>
                                    <input type="file" accept="image/*" hidden ref={imageRef} onChange={handleImage} />
                                    <Camera className="absolute" size={50} />
                                    <span style={{ color: 'white' }}>
                                        {data?.userData?.username[0]}
                                    </span>
                                </div>
                            ) : (
                                <Image src={frontendImage} alt="Profile Image" width={100} height={100} title="Profile image" className="rounded-full shadow-md cursor-pointer" style={{ width: 100, height: 100 }} />
                            )
                        )}
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <input type="text"
                                value={userName}
                                className="input"
                                name="username"
                                onChange={(e) => setUserName(e.target.value)} />
                            <button className="btn" onClick={handleEdit}>
                                {loading ? (
                                    <span className="loading loading-spinner text-neutral"></span>
                                ) : 'Save'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}