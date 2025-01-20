import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import { useWindowWidth } from '@react-hook/window-size/throttled';
import Image from "next/image";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import FollowerModel from "@/components/FollowerModel";
import { useSession, getSession } from "next-auth/react";


const ProfilePage = ({ followers, initialProfile, initialPosts, initialHasMore, sessionUserData }) => {

    const router = useRouter();
    const { username } = router.query;
    const [mounted, setMounted] = useState(false);
    const onlyWidth = useWindowWidth();
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [userProfile, setProfile] = useState(initialProfile);
    const [posts, setPosts] = useState(initialPosts);
    const [page, setPage] = useState(2);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [followStatus, setFollowStatus] = useState(false);
    const [userData, setUserData] = useState(sessionUserData);
    const [followersAndfollowing, setFollowersAndFollowing] = useState([]);
    const [followReqType, setFollowReqType] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const openModal = (params) => {
        setIsModalOpen(true);
        fetchFollowersAndFollowing(params);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const checkFollow = async () => {
        const isFollowing = userData.following.includes(userProfile.id);
        setFollowStatus(isFollowing);

        if (isFollowing) {
            setFollowReqType("unfollow");
        } else {
            setFollowReqType("follow");
        }
        return isFollowing;

    }



    useEffect(() => {  
        checkFollow(); 
    }, [userData]);


    if (!mounted) return null;


    const fetchFollowersAndFollowing = async (params) => {
        try {
            console.log(params)
          
          const response = await axios.get(`/api/fetch-followers-following`, {
            params: { username: params.username, reqType: params.reqType },
          });
          console.log(response.data.detail);
          setFollowersAndFollowing(response.data.detail)
        } catch (error) {
          console.error("Error fetching followers and following:", error);
        }
      }



    const fetchMorePosts = async () => {
        try {
            const response = await axios.get(`/api/fetch-posts`, {
                params: { username: username, page, reqType: "profile" },
            });

            const newPosts = response.data.posts;
            setPosts((prevPosts) => [...prevPosts, ...newPosts]);
            setPage((prevPage) => prevPage + 1);
            setHasMore(response.data.hasMore);
        } catch (error) {
            console.error("Error fetching more posts:", error);
        }
    };

    const follow = async (id) => {

        try {

            const response = await axios.post(`/api/follow`, {
                userId: session.user.id,
                followedId: id,
                followReqType: followReqType,
            });

            setUserData(response.data.User);
            
        } catch (error) {
            console.error("Error following user:", error);
        }
    };

    


    return (
        <div>
            <Navbar />



            <div className={`flex justify-center items-center w-full ${isModalOpen ? "blur-sm" : ""}`}>
                <div className="flex flex-col justify-center items-center w-[50%]">
                    <div className="relative m-auto w-40 h-40 rounded-full">
                        <Image
                            priority
                            quality={5}
                            src={userProfile.profileImg || "/pfp.webp"}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            placeholder="blur"
                            blurDataURL="/pfp.webp"
                            style={{ objectFit: "cover" }}
                            className="profile-image rounded-full"
                        />
                    </div>
                    <div className="username py-2">{username}</div>
                </div>
                <div className="flex flex-col w-[50%]">
                    <div className="flex justify-evenly mt-10">
                        <div onClick={()=>{openModal({reqType:"following",username:userProfile.username})}} className="flex flex-col justify-center items-center">
                            <div className="font-semibold">{userProfile.followers.length}</div>
                            <div>Follower</div>
                        </div>
                        <div onClick={()=>{openModal({reqType:"following",username:userProfile.username})}} className="flex flex-col justify-center items-center">
                            <div className="font-semibold">{userProfile.following.length}</div>
                            <div>Following</div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        <button onClick={() => follow(userProfile.id)} className="follow-btn w-40 h-10 bg-purp text-white rounded-3xl mt-5">{followStatus ? ("Unfollow") : ("follow")}</button>
                    </div>
                    <div className="pl-3 my-5">
                        Bio:<br />
                        {userProfile.bio}
                    </div>

                </div>
            </div>

            <hr className="border-purp" />


            <div className="parent w-full flex justify-evenly  ">

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
                                    <div className="post-username font-semibold w-full"><span className="text-purp">oh/</span>{username}</div>
                                    <p className="post-timestamp text-sm pb-5 absolute right-0">
                                        {new Date(post.createdAt).toLocaleString().slice(0, 10)}
                                    </p>
                                </div>


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
                                            className="post-image"
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

                {onlyWidth > 639 ? <div className="child-trending w-[30rem] bg-zinc-900 mt-5 rounded-3xl">
                    <div className="text-xl p-4 pl-6 font-semibold">Trending Section</div>
                    <hr className="border-purp"></hr>
                    <div className='flex justify-center items-center text-xl my-20'><i className="fa-solid fa-code text-2xl text-purp mr-5"></i><div>Explore page<br />under construction</div></div>

                </div> : ""}

            </div>
            {isModalOpen && (
                <FollowerModel followers={followersAndfollowing} type={fetchFollowersAndFollowing} onClose={closeModal} />
            )}

        </div>);
};

export default ProfilePage;

export async function getServerSideProps(context) {
    try {
        const { username } = context.query;
        const session = await getSession(context);
        if (!session) {
            return {
                redirect: {
                    destination: "/login",
                    permanent: false,
                },
            };
        }

        const sessionUsername = session.user.username;
        const baseURL = process.env.NEXTAUTH_URL || "http://localhost:3000";

        const profileRes = await axios.get(`${baseURL}/api/profile`, {
            params: { username, reqType: "profile" },
        });
        // const followersRes = await axios.get(`${baseURL}/api/get-followers`, {
        //     params: { username, reqType: "profile" },
        // });

        const response = await axios.get(`${baseURL}/api/profile`, {
            params: { username: sessionUsername, reqType: "profile" },
        });


        const postsRes = await axios.get(`${baseURL}/api/fetch-posts`, {
            params: { username, page: 1, reqType: "profile" },
        });

        return {
            props: {
                initialProfile: profileRes.data,
                initialPosts: postsRes.data.posts,
                initialHasMore: postsRes.data.hasMore,
                sessionUserData: response.data,
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

