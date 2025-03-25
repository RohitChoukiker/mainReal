import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"; 
import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/userModel"; 
import { signupSchema } from "../../../validators/userValidator"; 
// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET 

// POST request handler
export async function POST(req: NextRequest) {
  try {
    // Database connect karo
    await dbConnect();

    // Request body parse karo
    const body = await req.json();

    // Zod se validate karo (signupSchema ka use kar rahe hain assuming it fits)
    const parsedBody = signupSchema.pick({ email: true, password: true, role: true }).safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsedBody.error.format() },
        { status: 400 }
      );
    }

    const { email, password, role } = parsedBody.data;

    // User ko database se dhoondho
    const user = await User.findOne({ email, role }); // UserModel ki jagah User use kiya
    if (!user) {
      return NextResponse.json(
        { error: "User nahi mila ya role match nahi karta" },
        { status: 401 }
      );
    }

    // Password check (abhi plain text hai, hashing add karenge)
    if (user.password !== password) {
      return NextResponse.json(
        { error: "Galat password" },
        { status: 401 }
      );
    }

    // JWT token generate karo
    const token = jwt.sign(
      { email: user.email, role: user.role, id: user._id }, // Payload
      JWT_SECRET, // Secret key
      { expiresIn: "1d" } // Token expiry
    );

    // Success response
    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          email: user.email,
          role: user.role,
          id: user._id,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Kuch galat ho gaya, server error" },
      { status: 500 }
    );
  }
}