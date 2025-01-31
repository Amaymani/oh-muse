import { useRouter } from 'next/router'
import { use, useEffect, useState } from 'react'
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import Image from 'next/image';
import InfiniteScroll from "react-infinite-scroll-component";
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import PostEngagement from "@/components/PostEngagement";
const CommunityPage = ({ initialCommunity, initialPosts, initialHasMore }) => {

  const Router = useRouter();
  const { community_id } = Router.query;
  const [communityData, setCommunityData] = useState(initialCommunity);
  const [posts, setPosts] = useState(initialPosts);
  const onlyWidth = useWindowWidth();
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [joinedStatus, setJoinedStatus] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [commentOpenPostId, setCommentOpenPostId] = useState(null);
  const [commentText, setCommentText] = useState("");
  useEffect(() => {
    setIsHydrated(true);

    if (!isHydrated || status === "loading" || !communityData?.existingCom?.members || !session?.user?.id) {
      return; // Do nothing if not hydrated or loading, it is giving error upon the rendering of the page
    }

    const checkIfUserIsMember = () => {
      const isMember = communityData.existingCom.members.includes(session.user.id);

      isMember ? setJoinedStatus("Joined") : setJoinedStatus("Join");
      return isMember;
    };

    checkIfUserIsMember();
  }, [isHydrated, status, communityData, session?.user?._id, joinedStatus]);

  if (!isHydrated) {
    return <div>loading...</div>;
  }



  if (!loading && (!session || !session.user)) {
    Router.push("/login");
  }

  const openComment = (postId) => {
    setCommentOpenPostId((prev) => (prev === postId ? null : postId));
  };

  const closeComment = () => {
    setCommentOpenPostId(null);
  };

  const joinCommunity = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/join-community`,
        {
          user_id: session.user.id,
          community_id: community_id,
          reqType: "join"
        });
    }
    catch (error) {
      console.error("Error joining community:", error);

    }
  }

  const fetchMorePosts = async () => {
    try {

      const response = await axios.get(`/api/fetch-posts`, {
        params: { username: username, page },
      });

      const newPosts = response.data.posts;
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setPage((prevPage) => prevPage + 1);
      setHasMore(response.data.hasMore);

    } catch (error) {
      console.error("Error fetching more posts:", error);
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

  return (
    <div>

      <Navbar />
      <div className="flex justify-center items-center w-full">
        <div className="flex flex-col justify-center items-center w-[50%]">
          <div className="relative m-auto w-40 h-40 rounded-full">
            <Image
              priority
              quality={5}
              src={communityData.communityImgUrl || "/pfp.webp"}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL="/pfp.webp"
              style={{ objectFit: "cover" }}
              className="community-image rounded-full"
            />
          </div>
          <div className="username py-2 mb-3 font-semibold text-lg">{communityData.existingCom.communityName}</div>
          <button onClick={joinCommunity} className='px-6 py-3 bg-purp mb-5 rounded-full text-xl hover:bg-purple-700 duration-200 text-white hover:drop-shadow-xl transition-colors group'><i className="fa-regular fa-square-plus group-hover:text-yell pr-2 duration-200 transition-colors"></i>{joinedStatus}</button>
        </div>
        <div className="flex flex-col w-[50%]">

          <div className="pl-3 my-5 font-semibold">
            <div className='text-sm   '>
              Members: {communityData.existingCom.members.length}
            </div>
            <br />
            Description:<br />
            <div className='mt-2 font-normal'>{communityData.existingCom.desc}</div>
          </div>
        </div>
      </div>

      <hr className="border-purp" />

      <div className='flex justify-center items-center w-full mt-5'>
        <Link href={`${community_id}/create-community-post`} className='px-4 py-3 bg-purp rounded-full font-semibold text-white flex justify-center items-center'><i className="fa-solid fa-plus text-2xl pr-2"></i>Create Post</Link>
      </div>
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
                className="post p-7 mx-3 bg-gray-200 drop-shadow-xl dark:bg-zinc-900 rounded-3xl border-b-2 mt-5 border-purp  flex flex-col justify-center items-start overflow-hidden"
              >


                <div className="post-header flex  w-full relative mb-2">
                  <div className="post-username font-semibold w-full"><span className="text-purp">oh/</span>{post.user}</div>
                  <p className="post-timestamp text-sm pb-5 absolute right-0">
                    {new Date(post.createdAt).toLocaleString().slice(0, 10)}
                  </p>
                </div>


                {post.imageUrl && (
                  <div className="relative w-full h-96">
                    <Image
                      src={post.imageUrl}
                      quality={30}
                      blurDataURL="/post-loader.gif"
                      alt="Post"
                      fill
                      sizes="(max-width: 768px) 100vw, 
                       (max-width: 1200px) 80vw, 
                       70vw"
                      placeholder="blur"
                      style={{
                        objectFit: "contain",

                      }}
                      className="post-image"
                    />
                  </div>
                )}
                <div className="post-content text-left">
                  <h2 className="post-caption text-md pt-1">{post.text}</h2>

                </div>
                <PostEngagement post={post} userId={post.user} openComment={openComment} commentOpenPostId={commentOpenPostId} handleCommentChange={handleCommentChange} commentText={commentText} addComment={addComment} likePost={likePost} closeComment={closeComment} />
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

    </div>
  )
}

export default CommunityPage

export async function getServerSideProps(context) {
  try {



    const { community_id } = context.query;

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL|| "http://localhost:3000";

    const communityRes = await axios.get(`${baseURL}/api/community`, {
      params: { community_id },
    });



    const postsRes = await axios.get(`${baseURL}/api/fetch-posts`, {
      params: { page: 1, reqType: "community", community_id: community_id },
    });

    return {
      props: {
        initialCommunity: communityRes.data,
        initialPosts: postsRes.data.posts,
        initialHasMore: postsRes.data.hasMore,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        initialCommunity: { img: "", bio: "" },
        initialPosts: [],
        initialHasMore: false,
      },
    };
  }
}