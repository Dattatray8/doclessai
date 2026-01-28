'use client'

import { handleGoogleAuth, handleSignUp, handlGithubAuth } from "@/helpers/client/auth"
import { IUserRegister } from "@/types/auth.types"
import { user } from "@/types/redux.types"
import { Archivo_Black } from "next/font/google"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const appNameFont = Archivo_Black({
    subsets: ['latin'],
    weight: ['400']
})

export default function Register() {
    const [formValue, setFormValue] = useState<IUserRegister>({
        username: "",
        email: "",
        password: ""
    })
    const dispatch = useDispatch();
    const { authLoad } = useSelector((state: user) => state.user)
    const router = useRouter();
    console.log(formValue)

    return (
        <div className="flex justify-center">
            <div className="card w-96 bg-base-100 shadow-md">
                <div className="card-body">
                    <div className="flex flex-col gap-2 items-center">
                        <div className={`${appNameFont.className} text-4xl`}>AppPilot</div>
                        <p>Create your account to get started</p>
                    </div>
                    <div className="flex flex-col gap-4 text-center mt-6">
                        <div>
                            <label className="input validator">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </g>
                                </svg>
                                <input
                                    type="text"
                                    required
                                    placeholder="Username"
                                    pattern="[A-Za-z][A-Za-z0-9\-]*"
                                    minLength={3}
                                    maxLength={30}
                                    value={formValue.username}
                                    title="Only letters, numbers or dash"
                                    onChange={(e) => setFormValue({ ...formValue, username: e.target.value })}
                                />
                            </label>
                            <p className="validator-hint hidden">
                                Must be 3 to 30 characters and Only letters, numbers or dash
                            </p>
                        </div>
                        <div>
                            <label className="input validator">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                    </g>
                                </svg>
                                <input type="email" placeholder="mail@site.com" required
                                    onChange={(e) => setFormValue({ ...formValue, email: e.target.value })}
                                    value={formValue.email}
                                />
                            </label>
                            <div className="validator-hint hidden">Enter valid email address</div>
                        </div>
                        <div>
                            <label className="input validator">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path
                                            d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                                        ></path>
                                        <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                    </g>
                                </svg>
                                <input
                                    type="password"
                                    required
                                    placeholder="Password"
                                    minLength={8}
                                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                    value={formValue.password}
                                    onChange={(e) => setFormValue({ ...formValue, password: e.target.value })}
                                    title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                                />
                            </label>
                            <p className="validator-hint hidden">
                                Must be more than 8 characters, including
                                <br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter
                            </p>
                        </div>
                        <button className="btn" onClick={() => handleSignUp({ formValue, dispatch })}>{authLoad ? (
                            <span className="loading loading-spinner text-neutral"></span>
                        ) : "Register"}</button>
                        <div>
                            Already Have an account ? <span className="link" onClick={()=>router.push('/login')}>Login</span>
                        </div>
                    </div>
                    <span className="divider">OR</span>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="btn btn-outline" onClick={handleGoogleAuth}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </div>
                        <div className="btn btn-outline" onClick={handlGithubAuth}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            Github
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}