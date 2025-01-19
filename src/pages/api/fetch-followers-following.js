import User from "@/lib/models/user";
import connectDB from "@/lib/dbConnect";

export default async function fetchFollowersFollowing (req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { username, reqType } = req.query;

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        await connectDB();
        const { followers, following } = await User.findOne({ username: username }, { followers: 1, following: 1 });

        


        if (reqType === "followers") {
            const followersDetails = await User.find(
                { _id: { $in: followers } }, // Match all _id's in the followers array
                { username: 1, _id: 1 }       // Select only the username and _id fields
            );

            if (!followersDetails) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json({
                detail: followersDetails,
            });
        } else if (reqType === "following") {
            const followingDetails = await User.find(
                { _id: { $in: following } }, // Match all _id's in the followers array
                { username: 1, _id: 1 }       // Select only the username and _id fields
            );

            if (!followingDetails) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json({
                detail: followingDetails,
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}