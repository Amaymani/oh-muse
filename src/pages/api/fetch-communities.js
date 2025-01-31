import connectDB from "@/lib/dbConnect";
import Community from "@/lib/models/community";
import { getObjectURL } from "@/lib/s3Client";

export default async function handler(req, res) {

  if (req.method === "GET") {
    const { page } = req.query;
    console.log(page);

    if (page === "explore-communities") {
      try {
        connectDB();
        const communities = await Community.aggregate([
          {
            $addFields: { membersCount: { $size: "$members" } } // Add a field with the size of the 'members' array
          },
          {
            $sort: { membersCount: -1 } // Sort by the size in descending order
          },
          {
            $limit: 3 // Limit to top 3
          }
        ]);


        const communitiesWithSignedUrls = await Promise.all(
          communities.map(async (community) => {
            if (community.communityImg) {
              const signedUrl = await getObjectURL(community.communityImg);
              return {
                ...community,
                imageUrl: signedUrl,
              };
            } else {
              return {
                ...community,
                imageUrl: null,
              };
            }
          })
        );

        res.status(200).json({ communities: communitiesWithSignedUrls });
      } catch (error) {
        console.error("Error fetching communities from DB:", error);
        return res
          .status(404)
          .json({ error: "Communities not found" });
      }
    } else if (page === "search-communities") {
      const { query } = req.query;
      if (!query) return res.status(400).json({ error: 'Query is required' });

      try {
        await connectDB();
        const communities = await Community.find(
          { communityName: { $regex: query, $options: 'i' } },
          { communityName: 1 }
        ).limit(10);
        res.status(200).json(communities);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
    }
  } else {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}