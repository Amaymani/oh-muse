import connectDB from "@/lib/dbConnect";
import Community from "@/lib/models/community";
import { getObjectURL } from "@/lib/s3Client";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { community_id } = req.query;

        if (!community_id) {
            return res.status(400).json({ message: "Query failed to pass community name" });
        }

        await connectDB();
        const existingCom = await Community.findOne({ _id: community_id });

        if (!existingCom) {
            return res.status(404).json({ message: "Community not found" });
        }
        

        const communityImgUrl = existingCom.communityImg
        ? await getObjectURL(existingCom.communityImg)
        : null;

        const commData={
            existingCom,
            communityImgUrl: communityImgUrl,

        }

        console.log(commData)
        return res.status(200).json(
        commData

        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
