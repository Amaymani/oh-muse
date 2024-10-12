import Navbar from "@/components/Navbar";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [post, setPost] = useState("");

  const router = useRouter();
  const { data: session, status } = useSession();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePostChange = (e) => {
    setPost(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("post", post);
    const timestamp = new Date().getTime().toString(); // Get a timestamp for the filename
    try {
      const res = await axios.get("/api/create-a-post", {
        params: {
          filename: timestamp,
          filetype: file.type,
          username: session.user.username,
        },
      });
      const { url } = await res.data;
      try {
        const res = await axios.put(url, file, {
          headers: {
            "Content-Type": file.type,
          },
        });
      } catch (uploadError) {
        console.error(
          "File upload error:",
          uploadError.response?.data?.error || uploadError.message
        );
        return;
      }

      const postResponse = await axios.post("/api/create-a-post", {
        post,
        filename: timestamp,
        username: await session.user.username,
        headers: {
          username: await session.user.username,
        },
      });

      if (postResponse.status === 201) {
        router.push("/");
      }
    } catch (err) {
      console.error("Upload error:", err.response?.data?.error || err.message);
    }
  };
  return (
    <div>
      <Navbar />
      <div className="flex flex-col justify-center ">
        <form onSubmit={handleSubmit}>
          <div className="mt-3 ml-5 text-lg font-semibold">
            Make your P<span className="text-purp">oh</span>st
          </div>
          <div className="flex justify-center">
            <textarea
              name="post"
              onChange={handlePostChange}
              value={post}
              placeholder="Write your Pohst ohnomusely here..."
              className=" w-[80%] h-[6rem] mx-5 p-3 mt-3 border-b-2 border-gray-300  resize-none"
            ></textarea>
          </div>
          <input name="file" type="file" onChange={handleFileChange} />
          <button type="submit">Upload</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
