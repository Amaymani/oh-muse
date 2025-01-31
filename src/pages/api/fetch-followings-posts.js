import connectDB from "@/lib/dbConnect";
import Post from "@/lib/models/post";
import User from "@/lib/models/user";
import { getObjectURL } from "@/lib/s3Client";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        await connectDB();

        const { userId, page = 1 } = req.query;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const user = await User.findById(userId).lean();
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!user.following || user.following.length === 0) {
            return res.status(200).json({ posts: [], total: 0 });
        }

        const followingUsers = await User.find(
            { _id: { $in: user.following } },
            "username"
        ).lean();

        const followingUsernames = followingUsers.map(user => user.username);
        console.log(followingUsers);
        const limit = 10;
        const skip = (page - 1) * limit;


        const posts = await Post.find({ user: { $in: followingUsernames } })
            .populate("user", "username") 
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

            const postsWithSignedUrls = await Promise.all(
                posts.map(async (post) => {
                  if (post.images3key) {
                    const signedUrl = await getObjectURL(post.images3key);
                    return {
                      ...post.toObject(),
                      imageUrl: signedUrl,
                    };
                  } else {
                    return {
                      ...post.toObject(),
                      imageUrl: null,
                    };
                  }
                })
              );

                
        const totalPosts = await Post.countDocuments({ user: { $in: followingUsernames} });
        
        return res.status(200).json({ posts:postsWithSignedUrls, total: totalPosts });
    } catch (error) {
        console.error("Error fetching followings' posts:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
