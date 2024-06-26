import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

export async function POST(request: NextRequest): Promise<any> {
  await connect();
  try {
    const { username, email, password } = await request.json();
    const user = await User.findOne({ $or: [{ email }, { username }] });
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
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    //send verification email
    await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

    return NextResponse.json(
      {
        success: true,
        message: "user registered successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    // console.log("signup page error");
    return NextResponse.json(
      {
        success: false,
        message: error || "something went wrong in signup",
      },
      { status: 500 }
    );
  }
}
