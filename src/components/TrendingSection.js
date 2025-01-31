import React from 'react'

const TrendingSection = ({onlyWidth}) => {
    return (
        <div>

            {onlyWidth > 1023 ? (
                <div className="child-trending w-[30rem] bg-gray-200 drop-shadow-xl dark:bg-zinc-900 mt-5 rounded-3xl">
                    <div className="text-xl p-4 pl-6 font-semibold">Trending Section</div>
                    <hr className="border-purp"></hr>
                    <div className='flex justify-center items-center text-xl my-20'><i className="fa-solid fa-code text-2xl text-purp mr-5"></i><div>Explore page<br />under construction</div></div>
                </div>
            ) : ""}
        </div>
    )
}

export default TrendingSection