import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'


const ExploreCommunities = () => {

    const [communities, setCommunities] = useState([]);
    useEffect(() => {
        async function fetchMorePosts() {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"}/api/fetch-communities`
                    , {
                        params: {
                            page: "explore-communities",
                        },
                    });



                const communities = response.data.communities;
                setCommunities(communities);
            } catch (error) {
                console.error("Error fetching communities:", error);
            }
        };
        fetchMorePosts();
    }, []);


    return (
        <div className='flex flex-col justify-center items-center mt-10 text-2xl font-semibold'>
            <div className='flex sm:flex-row mb-5 flex-col justify-center items-center text-2xl font-semibold'>Popular <div>&nbsp; c<span className='text-purp font-bold text-2xl'>oh/</span>mmunities</div></div>
            <div className=' p-5 grid grid-cols-2 sm:grid-cols-3'>
                {/* Display communities */}
                {communities.map((community) => (
                    <Link key={community._id} href={`/community/${community._id}`}
                    className='flex m-3 place-content-evenly  flex-col justify-center items-center bg-zinc-900 p-5 rounded-lg'>
                        <Image
                            src={community.imageUrl}
                            width={50}
                            height={50}
                            alt={community.communityName}
                            className='sm:h-32 h-28 w-28  border-2 border-purp rounded-full sm:w-32 object-contain' />
                        <h2 className='text-xl mt-4'>{community.communityName}</h2>
                        
                        <p className='text-sm text-zinc-500'>members: {community.membersCount}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default ExploreCommunities