import connectDB from "@/lib/dbConnect";
import User from "@/lib/models/user";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { userId, followedId, followReqType } = req.body;

        if (!userId || !followedId || !followReqType) {
            return res.status(400).json({ message: "Username is required" });
        }
        console.log(userId, followedId, followReqType);

        await connectDB();

        if (followReqType === "unfollow") {
            const UserData = await User.findOneAndUpdate(
                { _id: userId },
                { $pull: { following: followedId } },
                { new: true });

            const followedUserData = await User.findOneAndUpdate(
                { _id: followedId },
                { $pull: { followers: userId } },
                { new: true });

            if (!UserData) {
                return res.status(404).json({ message: "Logged in User not found" });
            }

            return res.status(200).json({
                User: UserData,
            }) } 


            else if (followReqType === "follow") {
                const UserData = await User.findOneAndUpdate(
                    { _id: userId },
                    { $addToSet: { following: followedId } },
                    { new: true },
                    
                );

                const followedUserData = await User.findOneAndUpdate(
                    { _id: followedId },
                    { $addToSet: { followers: userId } },
                    { new: true }
                );
                
                if (!UserData) {
                    return res.status(404).json({ message: "Logged in User not found" });
                }

                return res.status(200).json({
                    User: UserData,
                    ViewedUser: followedUserData
                });
            }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}