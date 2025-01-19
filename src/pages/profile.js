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

export default function Profile({ followers, initialProfile, initialPosts, initialHasMore }) {
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
  const [followReqType, setFollowReqType] = useState(false);

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

  const openModal = (reqType) => {
    setIsModalOpen(true);
    fetchFollowersAndFollowing(reqType);
};

const closeModal = () => {
    setIsModalOpen(false);
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

  const fetchFollowersAndFollowing = async (reqType) => {
    try {
      
      const response = await axios.get(`/api/fetch-followers-following`, {
        params: { username: session.user.username, reqType: reqType },
      });
      console.log(response.data.detail);
      setFollowersAndFollowing(response.data.detail)
    } catch (error) {
      console.error("Error fetching followers and following:", error);
    }
  }

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
      <div className="flex justify-center items-center w-full">
        <div className="flex flex-col justify-center items-center w-[50%]">
          <div className="relative m-auto w-40 h-40 rounded-full">
            <Image
              priority
              quality={5}
              src={userProfile.profileImg || "/pfp.webp"}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 
         (max-width: 1200px) 50vw, 
         33vw"
              placeholder="blur"
              blurDataURL="/pfp.webp"
              style={{ objectFit: "cover" }}
              className="profile-image rounded-full"
            />
          </div>
          <div className="username py-2">{session.user.username}</div>
        </div>
        <div className="flex flex-col w-[50%]">
          <div className="flex justify-evenly mt-10">
            <div onClick={()=>{openModal("followers")}} className="flex flex-col justify-center items-center">
              <div className="font-semibold">{userProfile.followers.length}</div>
              <div>Follower</div>
            </div>
            <div onClick={()=>{openModal("following")}} className="flex flex-col justify-center items-center">
              <div className="font-semibold">{userProfile.following.length}</div>
              <div>Following</div>
            </div>
          </div>
          <div className="pl-3 my-5">
            Bio:<br />
            {userProfile.bio}
          </div>
          <Link
            href={"/edit-profile"}
            className="p-2 sm:p-4 bg-purp rounded-full flex justify-center my-5 mx-2"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      <hr className="border-purp" />


      <div className="parent w-full  flex justify-evenly  ">

        {/* <PostsComp posts={posts}/> */}
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
                className="post p-7 mx-3 bg-zinc-900 rounded-3xl border-b-2 mt-5 border-purp  flex flex-col justify-center items-start overflow-hidden"
              >


                <div className="post-header flex  w-full relative mb-2">
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
                <div className="engagement-stats flex justify-start  w-full mt-5">
                  <div className="Likes w-[50%] flex text-xl">
                    <i className="fa-solid fa-heart hover:text-purp transition-colors duration-150 "></i>
                    <div className="text-sm ml-5">100K</div>
                  </div>
                  <div className="Comments w-[50%] flex text-xl">
                    <i className="fa-solid fa-comment hover:text-purp  transition-colors duration-150"></i>
                    <div className="text-sm ml-5">100K</div>
                  </div>
                  <div><i className="fa-solid fa-flag hover:text-red-500  transition-colors duration-150"></i></div>
                </div>
              </div>
            ))}
          </InfiniteScroll>

        </div>
        

        {onlyWidth > 1023 ? <div className="child-trending w-[30rem] bg-zinc-900 mt-5 rounded-3xl">
          <div className="text-xl p-4 pl-6 font-semibold">Trending Section</div>
          <hr className="border-purp"></hr>
          <div className='flex justify-center items-center text-xl my-20'><i className="fa-solid fa-code text-2xl text-purp mr-5"></i><div>Explore page<br />under construction</div></div>

        </div> : ""}

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
    const baseURL = process.env.NEXTAUTH_URL || "http://localhost:3000";

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
