
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";
import { useState } from "react";


export default function Home() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();

  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!session || !session.user) {
    router.push("/login");
  }


  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center">
        <Link href={"/create-a-post"}  className="bg-purp p-3 px-5 rounded-full mb-4">Post</Link>
      </div>
      <div className="flex justify-center items-center w-auto">
      {/* <div className="child-posts w-full sm:w-[50%]">
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

        </div> */}
      </div>
    </>
  );
}
