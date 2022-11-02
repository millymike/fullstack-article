import { prisma } from "../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, content } = req.body;

  try {
    await prisma.article.create({
      data: {
        title,
        content,
      },
    });
    res.status(200).json({ message: "Article created" });
  } catch (error) {
    res.status(401).json({ message: "Failed to create" });
  }
}
