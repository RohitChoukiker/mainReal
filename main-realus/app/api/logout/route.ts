import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("authToken", "", {
      httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(0), 
    })
  );

  res.json({ message: "Logged out successfully" });
}
