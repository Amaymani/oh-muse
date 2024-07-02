import React from 'react'
import { useSession, signOut } from 'next-auth/react'

const profile = () => {

    const handleLogout = () => {
        signOut({ callbackUrl: '/login' });
      };
  return (
    <button onClick={handleLogout} className='p-4 bg-purp rounded-full m-5'>logout</button>
    
  )
}

export default profile