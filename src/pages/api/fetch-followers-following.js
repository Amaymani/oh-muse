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
                { _id: { $in: followers } }, 
                { username: 1, _id: 1 }       
            );
            

            if (!followersDetails) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json({
                detail: followersDetails,
            });
        } else if (reqType === "following") {
            const followingDetails = await User.find(
                { _id: { $in: following } }, 
                { username: 1, _id: 1 }      
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