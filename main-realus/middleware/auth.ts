import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = (handler: Function) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.authToken;

    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      (req as any).user = decoded;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};
