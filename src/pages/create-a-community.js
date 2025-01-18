import Navbar from '@/components/Navbar'
import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';

const createACommunity = () => {

  const router = useRouter();
  const [error, seterror]= useState("");
  const [wordCount, setWordCount] = useState(0);

  

  const [communityData, setCommunityData] = useState({
    name: "",
    bio: "",
    image: null,
  });

  useEffect(() => {
    
    setWordCount(communityData.name.length);
    if(communityData.name.length > 25){
      seterror("*Community name should be less than 25 characters");
    }else{
      seterror("")
    }
    

  }, [communityData.name, communityData.image]);
  const [submiterror, setSubmitError] = useState(null);

  const { data: session, status } = useSession();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCommunityData({ ...communityData, [name]: value });
  };

  const handleImageChange = (e) => {
    setCommunityData({ ...communityData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let filename = null;

    if(communityData.image===null){
      seterror("*Please upload an image for your community")
      return;
    }

    if (communityData.image) {
      const timestamp = new Date().getTime().toString(); // Get a timestamp for the filename
      filename = timestamp;


      try {

        const res = await axios.get('/api/create-a-community', {
          params: {
            filename: timestamp,
            filetype: communityData.image.type,
            modname: session.user.id
          }
        })

        const { url } = await res.data;

        try {
          await axios.put(url, communityData.image, {
            headers: {
              "Content-Type": communityData.image.type,
            },
          });
        } catch (uploadError) {
          console.error(
            "File upload error:",
            uploadError.response?.data?.error || uploadError.message
          );
          return;
        }

      } catch (error) {
        console.error("Error generating pre-signed URL but error found to be at client code:", error.response?.data?.error || error.message);
        return;

      }
    }

    try {
      const res = await axios.post('/api/create-a-community', {
        communityData, 
        headers: {
          username: session.user.id,
          filename:filename
        }
      });
      if (res.status === 400) {
        console.error("Missing required fields");
        setSubmitError("Missing required fields");

      }
      if (res.status === 201) {
        router.push('/community');
      }
    }
    catch (error) {
      console.error("error in community creation:", error.response?.data?.error || error.message)
    }
  };
  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-gray-200 rounded-lg shadow-lg max-w-2xl w-full p-6">
          <h1 className="text-2xl font-bold text-purp text-center mb-4">
            Create a New Community
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6 ">
            {/* Community Name */}
            <div>
              <label
                htmlFor="name"
                className="flex text-md font-medium text-gray-700 mb-1"
              >
                Community Name <div className='text-sm flex items-center text-zinc-400'>&nbsp;{ wordCount}/25</div>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={communityData.name}
                onChange={handleChange}
                className="border text-black bg-lightbg border-grey-light w-full p-3 rounded border-gray-300  focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter community name"
                required
              />
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="bio"
                className="block text-md font-medium text-gray-700 mb-1"
              >
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={communityData.bio}
                onChange={handleChange}
                rows="4"
                className="bg-lightbg text-black border-grey-light w-full p-3 rounded border border-gray-300  focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write a short description about your community"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label
                htmlFor="image"
                className="block text-md font-medium text-gray-700 mb-2"
              >
                Upload Community Image
              </label>
              <div className="flex items-center space-x-4">
                {/* Custom Upload Button */}
                <label
                  htmlFor="image"
                  className="cursor-pointer inline-flex items-center bg-purp text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <i className="fa-solid fa-upload pr-2"></i>
                  Choose File
                </label>

                {/* Display File Name */}
                {communityData.image && (
                  <span className="text-sm text-gray-600">{communityData.image.name}</span>
                )}

                {/* Hidden Input */}
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>


            {/* Submit Button */}
            <div className="text-center">
              <div className='tetx-sm text-red-500'>{error}</div>
              <button
                type="submit"
                className="text-white bg-purp font-medium  hover:font-bold transition-all ease-in-out duration-100  hover:bg-yell rounded focus:outline-none my-1  py-3 px-4 shadow-md  focus:ring-2"
              >
                Create Community
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default createACommunity