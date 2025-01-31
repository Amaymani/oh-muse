import connectDB from "@/lib/dbConnect";
import Post from "@/lib/models/post";
import User from "@/lib/models/user";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { postId, userId, action, commentText } = req.body;

    console.log("Received request:", userId)
    
    await connectDB();

    try {
        const post = await Post.findById(postId).populate("comments.user", "username");
        const user = await User.findById(userId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Ensure likes and comments arrays exist
        if (!Array.isArray(post.likes)) {
            post.likes = [];
        }
        if (!Array.isArray(post.comments)) {
            post.comments = [];
        }

        if (action === "like") {
            // Like/Unlike logic
            const isLiked = post.likes.some((like) => like.toString() === userId);
            if (isLiked) {
                post.likes = post.likes.filter((like) => like.toString() !== userId);
            } else {
                post.likes.push(userId);
            }
        } else if (action === "comment") {
            // Add comment logic
            if (!commentText || commentText.trim() === "") {
                return res.status(400).json({ message: "Comment text is required" });
            }

            const newComment = {
                user: userId,
                text: commentText,
                createdAt: new Date(),
            };

            post.comments.push(newComment);
        } else {
            return res.status(400).json({ message: "Invalid action" });
        }

        await post.save();

        // Repopulate comments after saving to include username
        await post.populate("comments.user", "username");

        console.log("Post updated:", post);
        res.status(200).json({ message: "Success", post });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
