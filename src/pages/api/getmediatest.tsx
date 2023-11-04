import { NextApiRequest, NextApiResponse } from "next";
import { getMedia } from "@lib/s3Components";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const key = req.query.sendkey as string;
    console.log("key", key)
    const imgUrl: { imgUrl: string, Key: string } = await getMedia(key as string);

    if (imgUrl) {
        res.status(200).json(imgUrl);
    }
}