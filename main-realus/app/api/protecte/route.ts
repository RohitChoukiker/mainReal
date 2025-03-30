import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../../../middleware/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.json({ message: `Welcome, your role is ${(req as any).user.role}` });
};

export default authMiddleware(handler);
