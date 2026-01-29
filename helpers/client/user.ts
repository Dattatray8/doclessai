import { AppDispatch } from "@/redux/store";
import { setUserData } from "@/redux/userSlice";
import axios from "axios";
import toast from "react-hot-toast";

export const getUser = async (dispatch: AppDispatch) => {
  try {
    const res = await axios.get("/api/v1/user", { withCredentials: true });
    dispatch(setUserData(res?.data.user));
  } catch (error: any) {
    console.log(error);
    toast.error(error?.response?.data?.message || error?.message);
  }
};