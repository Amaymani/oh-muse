import { putObject, deleteObject } from "@/lib/s3Client";
import connectDB from "@/lib/dbConnect";
import User from "@/lib/models/user";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { filename, filetype, username } = req.query;

    try {
      await connectDB();
      console.log("DB Connected");

      const user = await User.findOne({ username });

      deleteObject(user.profileImgKey)
      const url = await putObject(username, filename, filetype);

      return res.status(200).json({ url });
    } catch (error) {
      console.error("Error generating pre-signed URL:", error);
      return res
        .status(500)
        .json({ error: "Error generating pre-signed URL." });
    }
  } else if (req.method === "POST") {
    const { bio, filename, username } = req.body;

    if (!filename || !username) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const imageK = `pohsts/${username}/${filename}`;
    try {
      await connectDB();
      console.log("DB Connected");

      const UpdatedInfo = (!bio) ? { profileImgKey: imageK } : {
        bio: bio,
        profileImgKey: imageK,
      }
    ;
    const updatedDetails = await User.updateOne({ username: username }, { $set: UpdatedInfo })


    return res.status(201).json({
      message: "Profile updated successfully!",
    });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Failed to create post." });
  }
} else {
  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

}
