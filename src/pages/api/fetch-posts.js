import connectDB from "@/lib/dbConnect";
import Post from "@/lib/models/post";
import { getObjectURL } from "@/lib/s3Client";


export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { page = 1, reqType, community_id } = req.query; // Default page is 1
    const username= reqType === "profile" ? req.query.username : null;
    if (!username && reqType === "profile") {
      return res.status(400).json({ message: "Username not fetched to backend from client" });
    }

    await connectDB();

    const pageSize = 4;
    const skip = (parseInt(page) - 1) * pageSize;

    // Fetch posts with pagination
    const posts = reqType === "profile" ? (await Post.find({ user: username })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)) :
      (await Post.find({ communityid: community_id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize));

    // Generate signed URLs for posts with S3 keys
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

    return res.status(200).json({
      posts: postsWithSignedUrls,
      hasMore: postsWithSignedUrls.length === pageSize, // If posts fetched are less than `pageSize`, no more pages exist
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
