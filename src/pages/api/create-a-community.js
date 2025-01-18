import { putObject, getObjectURL } from "@/lib/s3Client";
import connectDB from "@/lib/dbConnect";
import Community from "@/lib/models/community";


export default async function handler(req, res) {
    if (req.method === "GET") {
        const { filename, filetype, modname } = req.query;

        try {
            const url = await putObject(modname, filename, filetype);
            console.log(modname, filename, filetype);

            return res.status(200).json({ url });
        } catch (error) {
            console.error("Error generating pre-signed URL:", error);
            return res
                .status(500)
                .json({ error: "Error generating pre-signed URL." });
        }
    } else if (req.method === "POST") {
        const { communityData } = req.body;
        const { username, filename } = req.body.headers;



        if(!filename){
            return res.status(400).json({ error: "Missing required fields." });
        }


        if (!communityData|| communityData.name.length>25) {
            return res.status(400).json({ error: "Missing required fields or character exceeded!" });
        }


        const imageK = `pohsts/${username}/${filename}`;
        console.log(imageK)

        try {
            await connectDB();
            console.log("DB Connected");

            const newCommunity = {
                communityName: communityData.name,
                desc: communityData.bio,
                modName: username,
                communityImg: imageK,
                members: [username]
            };

            console.log("New Post Object:", newCommunity);

            const savedCommunity = await Community.create(newCommunity);
            savedCommunity.communityImg = imageK;
            await savedCommunity.save();

            console.log(savedCommunity);

            return res.status(201).json({
                message: "Post created successfully!",
                postId: savedCommunity._id,
            });
        } catch (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to create post." });
        }







    } else {
        // Handle any other HTTP method
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}