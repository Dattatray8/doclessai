import { AppDispatch } from "@/redux/store";
import { setAuthLoad } from "@/redux/userSlice";
import { IUserLogin, IUserRegister } from "@/types/auth.types";
import axios from "axios";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export const handleSignUp = async ({
  formValue,
  dispatch,
}: {
  formValue: IUserRegister;
  dispatch: AppDispatch;
}) => {
  for (let key in formValue) {
    if (formValue[key as keyof IUserRegister] === "") {
      toast.error(`${key} is empty`);
      return;
    }
  }
  dispatch(setAuthLoad(true));
  try {
    const res = await axios.post("/api/v1/auth/signup", formValue, {
      withCredentials: true,
    });
    console.log(res.data);
    toast.success(res?.data?.message);
  } catch (error: any) {
    toast.error(error?.response?.data?.message || error?.message);
    dispatch(setAuthLoad(false));
  } finally {
    dispatch(setAuthLoad(false));
  }
};

export const handleLogin = async ({
  formValue,
  dispatch,
}: {
  formValue: IUserLogin;
  dispatch: AppDispatch;
}) => {
  for (let key in formValue) {
    if (formValue[key as keyof IUserLogin] === "") {
      toast.error(`${key} is empty`);
      return;
    }
  }
  dispatch(setAuthLoad(true));
  try {
    const res = await signIn("credentials", {
      email: formValue.email,
      password: formValue.password,
      redirect: false,
    });
    if (res?.ok) {
      toast.success("Login Successful!");
    } else {
      toast.error(res?.error || "Invalid Credentials");
    }
  } catch (error: any) {
    toast.error(error);
    dispatch(setAuthLoad(false));
  } finally {
    dispatch(setAuthLoad(false));
  }
};

export const handleGoogleAuth = async () => {
  await signIn("google", { callbackUrl: "/" });
};

export const handlGithubAuth = async () => {
  await signIn("github", { callbackUrl: "/" });
};
