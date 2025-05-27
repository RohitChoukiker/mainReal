import { NextRequest, NextResponse } from "next/server";
import UserModel, { Role } from "@/models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dbConnect from "@/utils/dbConnect";

const loginCache = new Map();

const JWT_SECRET = "123123123 "as string;

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json();
    

    const cacheKey = `${email}:${password}:${role}`;
    const cachedResponse = loginCache.get(cacheKey);
    
    if (cachedResponse) {
      
      return cachedResponse;
    }
    
    await dbConnect();
  
   
    const user = await UserModel.findOne({ email }).lean();
    if (!user) {
      return NextResponse.json({ message: "User is not Exist" }, { status: 401 });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Wrong password" }, { status: 401 });
    }
    

    let validRole = role;
    
    
    if (role === "TransactionCoordinator") {
      validRole = Role.Tc;
    } else if (role === "Tc") {
      
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
      { expiresIn: "7d" } 
    );

    
    let normalizedRole: string = user.role;
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
      httpOnly: true, 
      sameSite: "strict", 
      maxAge: 7 * 24 * 60 * 60, 
      path: "/", 
    });

    // Cache successful login response for 1 hour (adjust time as needed)
    loginCache.set(cacheKey, response);
    
    // Set a timeout to clear the cache entry after 1 hour
    setTimeout(() => {
      loginCache.delete(cacheKey);
    }, 60 * 60 * 1000);
    
    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
