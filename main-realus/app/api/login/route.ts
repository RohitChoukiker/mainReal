import { NextRequest, NextResponse } from "next/server";
import UserModel, { Role } from "@/models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dbConnect from "@/utils/dbConnect";

const JWT_SECRET = "123123123 "as string;

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
  
    const { email, password, role } = await req.json();

    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User is not Exist" }, { status: 401 });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Wrong password" }, { status: 401 });
    }
    
    // Handle role validation with proper conversion
    let validRole = role;
    
    // Convert frontend role value to match database enum values
    if (role === "TransactionCoordinator") {
      validRole = Role.Tc;
    } else if (role === "Tc") {
      // If frontend sends "Tc", convert it to match the database value "TransactionCoordinator"
      validRole = Role.Tc;
    }
    
    if (user.role !== validRole) {
      return NextResponse.json({ message: "Invalid role" }, { status: 401 });
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        isApproved: user.isApproved 
      },
      JWT_SECRET,
      { expiresIn: "7d" } // Token valid for 7 days
    );

    // Normalize the role for frontend consistency
    let normalizedRole = user.role;
    if (user.role === "TransactionCoordinator") {
      normalizedRole = "Tc";
    }

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: normalizedRole, // Use normalized role for frontend
        isApproved: user.isApproved,
        brokerId: user.brokerId, // Include the broker ID
        token: token,
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
