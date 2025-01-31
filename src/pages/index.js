import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";
import { useEffect, useState } from "react";
import PostEngagement from "@/components/PostEngagement";

export default function Home() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [commentOpenPostId, setCommentOpenPostId] = useState(null);
    const [commentText, setCommentText] = useState("");

    useEffect(() => {
      setMounted(true);
    }, []);


    useEffect(() => {
      if (!session || !session.user) {
        router.push("/login");
      }
    }, [session, router]);
    const fetchPosts = async () => {
      if (!session?.user?.id) return; 
  
      try {
        const response = await axios.get("/api/fetch-followings-posts", {
          params: { userId: session.user.id, page },
        });
  
        const data = response.data;
  
        if (data.posts.length === 0) {
          setHasMore(false);
        } else {
          setPosts((prev) => {
            // Avoid adding duplicate posts
            const existingPostIds = new Set(prev.map(post => post._id));
            const newPosts = data.posts.filter(post => !existingPostIds.has(post._id));
    
            return [...prev, ...newPosts];
          });
    
          setPage((prevPage) => prevPage + 1);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    useEffect(() => {
      
  
        fetchPosts(); // Only fetch posts if user is authenticated
  
    }, []); 

  if (!mounted || loading) {
    return <div>Loading...</div>;
  }

  

  const openComment = (postId) => {
    setCommentOpenPostId((prev) => (prev === postId ? null : postId));
  };

  const closeComment = () => {
    setCommentOpenPostId(null);
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
    <>
      <Navbar />
      <div className="flex justify-center text-xl text-center items-center">
        <div className="flex mt-5 justify-center items-center">
        <div className="flex justify-center items-center pr-4">Create your P<span className="text-purp font-bold">/oh</span>st</div>
        <Link href={"/create-a-post"} className="bg-purp p-2 px-3 rounded-lg  font-bold text-white text-lg hover:bg-purple-500 transition-colors duration-150">
          Post
        </Link>
        </div>
      </div>
      <div className="flex justify-center items-center w-auto">
        <div className="child-posts w-full sm:w-[50%]">
          <InfiniteScroll
            dataLength={posts.length}
            next={fetchPosts}
            hasMore={hasMore}
            loader={<h4 className="flex justify-center items-center">Loading...</h4>}
            endMessage={
              <p style={{ textAlign: "center", paddingTop: "1em" }}>
                <b>You just reached the end!!!</b>
              </p>
            }
          >
            {posts.map((post) => (
              <div
                key={post._id}
                className="post p-7 mx-3 bg-zinc-900 rounded-3xl border-b-2 mt-5 border-purp flex flex-col justify-center items-start overflow-hidden"
              >
                {/* Post Header */}
                <div className="post-header flex w-full relative mb-2">
                  <div className="post-username font-semibold w-full">
                    <span className="text-purp">oh/</span>{post.user}
                  </div>

                  <p className="post-timestamp text-sm pb-5 absolute right-0">
                    {new Date(post.createdAt).toLocaleString().slice(0, 10)}
                  </p>
                </div>

                
                {post.communityid && (
                  <div className="mb-5">
                    <Link href={`/community/${post.communityid}`} className="text-purp font-extrabold">
                      C/ohmmunity Post - View c/ohmmunity
                    </Link>
                  </div>
                )}

                
                {post.images3key && (
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
                      style={{ objectFit: "contain" }}
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
      </div>
    </>
  );
}
