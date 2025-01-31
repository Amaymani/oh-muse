import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const ProfileHeader = ({userProfile, openModal}) => {
  return (
    <div className="flex justify-center items-center w-full">
        <div className="flex flex-col justify-center items-center w-[50%]">
          <div className="relative m-auto w-40 h-40 rounded-full">
            <Image
              priority
              quality={5}
              src={userProfile.profileImg || "/pfp.webp"}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 
         (max-width: 1200px) 50vw, 
         33vw"
              placeholder="blur"
              blurDataURL="/pfp.webp"
              style={{ objectFit: "cover" }}
              className="profile-image rounded-full"
            />
          </div>
          <div className="username py-2">{userProfile.username}</div>
        </div>
        <div className="flex flex-col w-[50%]">
          <div className="flex justify-evenly mt-10">
            <div onClick={() => { openModal({ reqType: "followers", username: userProfile.username }) }} className="flex flex-col justify-center items-center">
              <div className="font-semibold">{userProfile.followers.length}</div>
              <div>Follower</div>
            </div>
            <div onClick={() => { openModal({ reqType: "following", username: userProfile.username }) }} className="flex flex-col justify-center items-center">
              <div className="font-semibold">{userProfile.following.length}</div>
              <div>Following</div>
            </div>
          </div>
          <div className="pl-3 my-5">
            Bio:<br />
            {userProfile.bio}
          </div>
          <Link
            href={"/edit-profile"}
            className="p-2 sm:p-4 bg-purp rounded-full flex justify-center my-5 mx-2"
          >
            Edit Profile
          </Link>
        </div>
      </div>
  )
}

export default ProfileHeader