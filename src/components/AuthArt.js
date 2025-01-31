import React from 'react'

const AuthArt = () => {
  return (
    <div className=''>
         <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg space-y-8 text-center">
        
 
        <div className="mb-4">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purp to-yell">OhMuse</h1>
        </div>


        <div className="space-y-4">
            <p className="text-2xl font-semibold text-gray-800">"Share your Thoughts"</p>
            <p className="text-xl text-gray-600 italic">"Inspire and Be Inspired"</p>
            <p className="text-lg text-gray-700">Join a community of creators, innovators and seekers.</p>
        </div>
        

        <div className="mt-8 space-y-4">
            <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">🎭</span>
                </div>
            </div>
            
        </div>

    </div>
    </div>
  )
}

export default AuthArt