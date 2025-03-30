import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dbConnect from "@/utils/dbConnect";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" } // Token valid for 7 days
    );

    // Set token in HTTP-Only Cookie
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true, // Prevents client-side access
      sameSite: "strict", // Prevents CSRF attacks
      maxAge: 7 * 24 * 60 * 60, // 7 days expiry
      path: "/", // Available across entire site
    });

    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
