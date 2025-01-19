import connectDB from "@/lib/dbConnect";
import User from "@/lib/models/user";
import { getObjectURL } from "@/lib/s3Client";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { username } = req.query;

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        await connectDB();
        const existingUser = await User.findOne({ username: username });

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const profileImgUrl = existingUser.profileImgKey
            ? await getObjectURL(existingUser.profileImgKey) // Note:  re edit and convert it into non string, it is done to save cost
            : "";

        return res.status(200).json({
            id:existingUser._id,
            username: existingUser.username,
            email: existingUser.email,
            profileImg: profileImgUrl,
            bio: existingUser.bio,
            followers: existingUser.followers,
            following: existingUser.following,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
