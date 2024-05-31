import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { ApiResponse } from "@/types/ApiResponse";

export async function POST(request: NextRequest): Promise<any> {
  await connect();
  try {
    const { username, email, password } = await request.json();
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        {
          success: false,
          message: "user already exists",
        },
        { status: 400 }
      );
    }
    //hash Password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    console.log("test0");
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    // console.log("saved user: ", savedUser);
    return NextResponse.json(
      {
        success: true,
        message: "user registered successfully",
        savedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "something went wrong in signup",
      },
      { status: 500 }
    );
  }
}
