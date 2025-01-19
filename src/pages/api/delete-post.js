import Post from "@/lib/models/post";
import connectDB from "@/lib/dbConnect";
import { deleteObject } from "@/lib/s3Client";


export default async function deletePost  (req, res)  {
    if (req.method !== "DELETE") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { postId } = req.body;

        if (!postId) {
            return res.status(400).json({ error: "Missing required query parameters" });
        }

        await connectDB();

        const post = await Post.findByIdAndDelete(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        if (post.images3key) await deleteObject(post.images3key);


        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}