import connectDB from "@/lib/dbConnect";
import community from "@/lib/models/community";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { community_id, user_id } = req.body;

        if (!community_id || !user_id) {
            return res.status(400).json({ error: "Missing required query parameters" });
        }

        await connectDB();

        const communityData = await community.findOneAndUpdate(
            { _id: community_id },
            { $addToSet: { members: user_id } },
            {$inc: { membersCount: 1 } },
            { new: true } 
          );

          if (!communityData) {
            return res.status(404).json({ error: "Community not found" });
          }
        // I have to add user_id to the members array in community object : DONE

        return res.status(200).json(communityData);
    } catch (error) {
        console.error("Error fetching community data:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}