import React, { useEffect, useState } from "react";
import { useSession, signOut, getSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";
import Link from "next/link";
import { useWindowWidth } from '@react-hook/window-size/throttled';
import Image from "next/image";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import FollowerModel from "@/components/FollowerModel";
import ProfileHeader from "@/components/ProfileHeader";
import PostEngagement from "@/components/PostEngagement";
import TrendingSection from "@/components/TrendingSection";

export default function Profile({  initialProfile, initialPosts, initialHasMore }) {
  const Router = useRouter();
  const [mounted, setMounted] = useState(false);
  const onlyWidth = useWindowWidth();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [userProfile, setProfile] = useState(initialProfile);
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [dropdownOpenPostId, setDropdownOpenPostId] = useState(null);
  const [followersAndfollowing, setFollowersAndFollowing] = useState([]);
  const [commentOpenPostId, setCommentOpenPostId] = useState(null);
  const [commentText, setCommentText] = useState("");

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

  const openModal = (params) => {
    setIsModalOpen(true);
    fetchFollowersAndFollowing(params);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openComment = (postId) => {
    setCommentOpenPostId((prev) => (prev === postId ? null : postId));
  };

  const closeComment = () => {
    setCommentOpenPostId(null);
  };

  const toggleDropdown = (postId) => {
    setDropdownOpenPostId((prev) => (prev === postId ? null : postId));
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(`/api/delete-post`, { data: { postId } });
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      setDropdownOpenPostId(null);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const likePost = async (postId) => {
    try {
      const response = await axios.post(`/api/add-like-comments`, { postId, userId: session.user.id, action: "like" });
      const updatedPost = response.data.post;

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: updatedPost.likes } : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const addComment = async (postId, e) => {
    e.preventDefault();
    try {

      const response = await axios.post("/api/add-like-comments", {
        postId,
        userId: session.user.id,
        action: "comment",
        commentText,
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, comments: response.data.post.comments } : post
        )
      );
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleCommentChange = (e) => {
    setCommentText(e);
  }
  const fetchFollowersAndFollowing = async (params) => {
    try {
      const response = await axios.get(`/api/fetch-followers-following`, {
        params: { username: params.username, reqType: params.reqType },
      });
      setFollowersAndFollowing(response.data.detail);
    } catch (error) {
      console.error("Error fetching followers and following:", error);
    }
  };

  const fetchMorePosts = async () => {
    try {
      if (!session?.user?.username) {
        console.error("No username found in session.");
        return;
      }
      const response = await axios.get(`/api/fetch-posts`, {
        params: { username: session.user.username, page, reqType: "profile" },
      }); 

      const newPosts = response.data.posts;
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setPage((prevPage) => prevPage + 1);
      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error("Error fetching more posts:", error);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div>
      <Navbar />

      <ProfileHeader userProfile={userProfile} openModal={openModal} />

      <hr className="border-purp" />

      <div className="parent w-full flex justify-evenly">
        <div className="child-posts w-full sm:w-[50%]">
          <InfiniteScroll
            className=""
            dataLength={posts.length}
            next={fetchMorePosts}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: "center", paddingTop: "1em" }}>
                <b>You just reached the end !!!</b>
              </p>
            }
          >
            {posts.map((post) => (
              <div
                key={post._id}
                className="post p-7 mx-3 bg-zinc-900 rounded-3xl border-b-2 mt-5 border-purp flex flex-col justify-center items-start overflow-hidden"
              >
                <div className="post-header flex w-full relative mb-2">
                  <div className="post-username font-semibold w-full"><span className="text-purp">oh/</span>{session.user.username}</div>
                  <p className="post-timestamp text-sm pb-5 absolute right-0">
                    {new Date(post.createdAt).toLocaleString().slice(0, 10)}
                    <i onClick={() => toggleDropdown(post._id)}
                      className="fa-solid fa-ellipsis-vertical px-2 text-xl cursor-pointer"
                    ></i>
                    {dropdownOpenPostId === post._id && (
                      <ul className="dropdown-menu bg-zinc-800 rounded-md shadow-lg absolute right-0 mt-2 z-10">
                        <li
                          className="dropdown-item px-4 py-2 hover:bg-zinc-700 cursor-pointer"
                          onClick={() => deletePost(post._id)}
                        >
                          Delete Post
                        </li>
                      </ul>
                    )}
                  </p>
                </div>

                {post.communityid && (<div className="mb-5"><Link href={`/community/${post.communityid}`} className="text-purp font-extrabold">C/ohmmunity Post - View c/ohmmunity</Link></div>)}

                {post.imageUrl && (
                  <div className="relative w-full h-96">
                    <Image
                      src={post.imageUrl}
                      quality={30}
                      blurDataURL="/loader.gif"
                      alt="Post"
                      fill
                      sizes="(max-width: 768px) 100vw, 
           (max-width: 1200px) 80vw, 
           70vw"
                      placeholder="blur"
                      style={{
                        objectFit: "contain",
                      }}
                      className="post-image z-0"
                    />
                  </div>
                )}
                <div className="post-content text-left">
                  <h2 className="post-caption text-md pt-1">{post.text}</h2>
                </div>


                <PostEngagement post={post} userId={session.user.id} openComment={openComment} commentOpenPostId={commentOpenPostId} handleCommentChange={handleCommentChange} commentText={commentText} addComment={addComment} likePost={likePost} closeComment={closeComment} />

              </div>
            ))}
          </InfiniteScroll>
        </div>

        {<TrendingSection onlyWidth={onlyWidth} />}
      </div>

      <button onClick={handleLogout} className="p-4 bg-purp rounded-full m-5">
        logout
      </button>
      {isModalOpen && (
        <FollowerModel followers={followersAndfollowing} type={fetchFollowersAndFollowing} onClose={closeModal} />
      )}
    </div>
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
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

    const profileRes = await axios.get(`${baseURL}/api/profile`, {
      params: { username },
    });

    const postsRes = await axios.get(`${baseURL}/api/fetch-posts`, {
      params: { username, page: 1, reqType: "profile" },
    });

    return {
      props: {
        initialProfile: profileRes.data,
        initialPosts: postsRes.data.posts,
        initialHasMore: postsRes.data.hasMore,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        initialProfile: { img: "", bio: "" },
        initialPosts: [],
        initialHasMore: false,
      },
    };
  }
}