import connectDB from "@/lib/dbConnect";
import Post from "@/lib/models/post";
import { ObjectId } from "mongodb";
import { getObjectURL } from "@/lib/s3Client";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { username } = req.query;
        console.log(username + "-------------------")

        // Check if required parameters are provided and valid
        if (!username) {
            return res.status(400).json({ message: "Username not fetched to backend from client" });
        }

        await connectDB();

        // Query for posts using lastPostId (cast it to ObjectId)
        const posts = await Post.find({ user: username })
            .sort({ createdAt: -1 }) // Sort in descending order to get the latest posts first
            .limit(20); // Adjust limit as needed
        

        const postsWithSignedUrls = await Promise.all(
            posts.map(async (post) => {
                const signedUrl = await getObjectURL(post.images3key); // getObjectURL generates the signed URL
                return {
                    ...post.toObject(),
                    imageUrl: signedUrl, // Include the signed URL in the response
                };
            })
        );

        if (postsWithSignedUrls.length === 0) {
            return res.status(404).json({ message: "No more posts" });
          }

        return res.status(200).json({
            posts: postsWithSignedUrls,
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
