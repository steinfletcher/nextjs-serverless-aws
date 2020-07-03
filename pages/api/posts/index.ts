import {NextApiRequest, NextApiResponse} from "next";
import {Post} from "../../../src/post";

export default function handler(req: NextApiRequest, res: NextApiResponse<Post[]>) {
    res.status(200).json([
        {
            id: 1,
            title: "Post 1"
        },
        {
            id: 2,
            title: "Post 2"
        },
        {
            id: 3,
            title: "Post 3"
        }
    ])
}
