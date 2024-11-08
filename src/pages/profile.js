import React from "react";
import { useSession, signOut, getSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";
import { useWindowWidth } from '@react-hook/window-size/throttled'
import { useState } from "react";
import Image from "next/image";
import axios from 'axios';

export default function profile({ initialProfile, posts }) {
  const Router = useRouter();
  const [mounted, setMounted] = useState(false);
  const onlyWidth = useWindowWidth();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [userProfile, setProfile] = useState(initialProfile);

  useEffect(() => {
    setMounted(true);

  }, []);


  if (!mounted) return null;

  if (loading) {
    return <div>Loading...</div>;
  }


  if (!session || !session.user) {
    Router.push("/login");
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center w-full">
        <div className="flex flex-col justify-center items-center w-[50%]">
          <div className="relative m-auto w-40 h-40 rounded-full">
            <Image priority quality={5} src={userProfile.profileImg || "/pfp.webp"} alt="" fill  //Note: make it userProfile.profileImg
              placeholder="blur" blurDataURL="/pfp.webp" style={{ objectFit: "cover" }} className='profile-image rounded-full'></Image>
          </div>
          <div className="username py-2">{session.user.username}</div>
        </div>
        <div className="flex flex-col w-[50%]">
          <div className="flex justify-evenly mt-10">
            <div className="flex flex-col justify-center items-center">
              <div className="font-semibold">100</div>
              <div>Follower</div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className="font-semibold">10000</div>
              <div>Following</div>
            </div>
          </div>
          <div className="pl-3 my-5">Bio:<br></br>{userProfile.bio}</div>
          <Link
            href={"/edit-profile"}
            className="p-2 sm:p-4 bg-purp rounded-full flex justify-center my-5 mx-2"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      <hr className="border-purp" />
      <div className="posts-timeline flex flex-col justify-center ">
        {posts.map((post) => (
          <div key={post._id} className="post border-b-2 mt-5 border-purp m-auto flex flex-col justify-center items-start  w-full max-w-md overflow-hidden">
            <div className="relative w-full h-96">
              <Image src={post.imageUrl} quality={10} blurDataURL="/pfp.webp" alt="Post" fill placeholder="blur" style={{
                objectFit: 'cover',
              }} className="post-image" /></div>
            <div className="post-content text-left">
              <h2 className="post-caption text-xl p-2 pt-3">{post.text}</h2>
              <p className="post-timestamp text-sm pb-5">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      <hr className="border-purp" />

      <button onClick={handleLogout} className="p-4 bg-purp rounded-full m-5">
        logout
      </button>
    </>
  );
}
export async function getServerSideProps(context) {
  try {
    const session = await getSession(context);
    if (!session) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const username = session.user.username;
    const baseURL = process.env.NEXTAUTH_URL || "http://localhost:3000";

    // Fetch profile data
    const profileRes = await axios.get(`${baseURL}/api/profile`, {
      params: { username },
    });

    const postsRes = await axios.get(`${baseURL}/api/fetch-posts`, {
      params: { username },
    });

    return {
      props: {
        initialProfile: profileRes.data,
        posts: postsRes.data.posts,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        initialProfile: { img: "", bio: "" },
        posts: [],
      },
    };
  }
}