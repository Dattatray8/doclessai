import authOptions from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || !session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "user not authenticated",
        },
        { status: 400 },
      );
    }
    const user = await User.findById(session.user.id).select("-password");
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "user fetched successfully",
        user,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in fetching profile",
        error,
      },
      { status: 500 },
    );
  }
}
