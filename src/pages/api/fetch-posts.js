import connectDB from "@/lib/dbConnect";
import Post from "@/lib/models/post";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { username } = req.query;
    console.log(username+"-------------------")

    // Check if required parameters are provided and valid
    if (!username) {
      return res.status(400).json({ message: "Username not fetched to backend from client" });
    }

    await connectDB();

    // Query for posts using lastPostId (cast it to ObjectId)
    const posts = await Post.find({ user: username })
      .sort({ createdAt: -1 }) // Sort in descending order to get the latest posts first
      .limit(5); // Adjust limit as needed

    if (posts.length === 0) {
      return res.status(404).json({ message: "No more posts" });
    }

    return res.status(200).json({
      posts: posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
