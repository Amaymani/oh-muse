import React from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import { getObjectURL } from "@/lib/s3Client";

const editProfile = () => {
  const [image, setImage] = useState(null);
  const [bio, setBio] = useState("");
  const router = useRouter();

  const { data: session, status } = useSession();
  const loading = status === "loading";
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session || !session.user) {
    router.push("/login");
  }

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("profileImage", image);
    formData.append("bio", bio);

    const profileImageName = `${session.user.username}-profile`;

    try {
      const res = await axios.get("/api/edit-profile", {
        params: {
          filename: profileImageName,
          filetype: image.type,  // Changed from `file` to `image`
          username: session.user.username,
        },
      });
      const { url } = await res.data;

      // Upload the file to the S3 presigned URL
      try {
        await axios.put(url, image, {  // Changed `file` to `image`
          headers: {
            "Content-Type": image.type,  // Changed `file` to `image`
          },
        });
      } catch (uploadError) {
        console.error(
          "File upload error:",
          uploadError.response?.data?.error || uploadError.message
        );
        return;
      }

      // Make the post request to update the user's profile in the database
      const postResponse = await axios.post(
        "/api/edit-profile",
        {
          bio,
          filename: profileImageName,
          username: session.user.username,
        }
      );

      if (postResponse.status === 201) {
        router.push("/profile");
      }
    } catch (err) {
      console.error("Upload error:", err.response?.data?.error || err.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col justify-center mt-5">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col justify-center items-center">
            <div className="flex justify-center items-center w-40 h-40 relative rounded-full mt-10 hover:opacity-80">
              <div className="absolute text-7xl text-gray-500 ">+</div>
              <input
                type="file"
                name="profileImage"
                onChange={handleImageChange}
                className="profile-image bg-gray-300 w-40 h-40 rounded-full"
              />
            </div>
            <div className="mt-10">Username: {session.user.username}</div>
            <input
              placeholder="Bio"
              onChange={handleBioChange}
              value={bio}
              name="bio"
              className="border-b mt-5"
            />
            <button
              type="submit"
              className="mt-10 px-4 py-2 bg-purp rounded-full flex justify-center my-5 mx-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default editProfile;
