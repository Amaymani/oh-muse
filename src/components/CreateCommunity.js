import React from 'react'
import Link from 'next/link'


const CreateCommunity = () => {
    return (
        <div className='child-create-community mt-5 flex justify-center items-center'>
            <div className='flex sm:flex-row flex-col justify-center items-center text-2xl font-semibold'>Create your <div>&nbsp; c<span className='text-purp font-bold text-2xl'>oh/</span>mmunity</div></div>
            <Link href='/create-a-community' className='flex group justify-center items-center bg-purp ml-5 rounded-full '>
                <i className="group-hover:text-yell transition-colors duration-300 fa-solid fa-square-plus text-3xl px-5 " aria-hidden="true"></i>
                <span className='text-lg font-semibold pr-5 py-3'>Create</span>
            </Link>
        </div>
    )
}

export default CreateCommunity