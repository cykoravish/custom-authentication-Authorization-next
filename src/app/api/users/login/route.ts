import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  await connect();
  try {
    const { email, password } = await request.json();

    //check user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "user does not exists",
        },
        { status: 404 }
      );
    }
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        {
          success: false,
          message: "invalid credentials",
        },
        { status: 400 }
      );
    }
    //create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    //creating token token
    const token = await jwt.sign(tokenData, process.env.JWT_TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successfully",
      },
      { status: 200 }
    );
    response.cookies.set("token", token, { httpOnly: true });
    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error || " something went wrong in login route",
      },
      { status: 500 }
    );
  }
}
