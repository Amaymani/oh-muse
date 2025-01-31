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
    if (file) {
      formData.append("file", file);
    }
    formData.append("post", post);

    try {
      let filename = null;

      if (file) {
        const timestamp = new Date().getTime().toString(); // Get a timestamp for the filename
        filename = timestamp;

        // Request a signed URL for file upload
        const res = await axios.get("/api/create-a-post", {
          params: {
            filename: timestamp,
            filetype: file.type,
            username: session.user.username,
          },
        });
        const { url } = await res.data;

        // Upload the file to the signed URL
        try {
          await axios.put(url, file, {
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
      }

      // Create the post with or without the file
      const postResponse = await axios.post("/api/create-a-post", {
        post,
        filename,
        username: session.user.username,
        headers: {
          username: session.user.username,
        },
      });

      if (postResponse.status === 201) {
        router.push("/");
      }
    } catch (err) {
      console.error("Error:", err.response?.data?.error || err.message);
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
              className="w-[80%] h-[6rem] mx-5 p-3 mt-3 border-b-2 border-gray-400 resize-none"
            ></textarea>
          </div>






          <div className="flex items-center justify-center ml-5 mt-5">
            <div className="flex items-center flex-col space-x-4">
              {/* Custom Upload Button */}
              <label
                htmlFor="image"
                className="cursor-pointer inline-flex items-center bg-purp text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <i className="fa-solid fa-upload pr-2"></i>
                Choose File
              </label>

              {/* Display File Name */}
              {file && (
                <span className="text-sm text-gray-600">{file.name}</span>
              )}

              {/* Hidden Input */}
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>




          <div className="flex justify-center items-center mt-5">
            <button className="py-3 px-3 rounded-xl bg-purp flex justify-center text-white items-center" type="submit">Upload</button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
