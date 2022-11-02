import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const articleId = req.query.id;

  if (req.method === "DELETE") {
    const article = await prisma.article.delete({
      where: { id: Number(articleId) },
    });

    res.json(article);
  } else {
    console.log("article could not be deleted");
  }
}
