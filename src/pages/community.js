import Navbar from '@/components/Navbar'
import React from 'react'
import CreateCommunity from '@/components/CreateCommunity'
import SearchCommunity from '@/components/SearchCommunity'
import ExploreCommunities from '@/components/ExploreCommunities'


const community = () => {

    return (
        <div className=''>
            <Navbar />
            <div className='parent flex flex-col justify-center'>
                <div className='flex flex-col'>
                    <CreateCommunity />
                    <SearchCommunity />
                    <ExploreCommunities /> 
                </div>




                <div className='explore-community'>
                    <div className='flex justify-center items-center text-xl mt-20'>
                        <i className="fa-solid fa-code text-2xl text-purp mr-5" aria-hidden="true"></i>
                        <div>Explore page<br />under construction</div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default community