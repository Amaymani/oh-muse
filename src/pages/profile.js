import React from "react";
import { useSession, signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";
import { useWindowWidth} from '@react-hook/window-size/throttled'
import { useState } from "react";

export default function profile() {
  const Router = useRouter();
  const [mounted, setMounted]=useState(false);
  const onlyWidth = useWindowWidth();
  const { data: session, status } = useSession();
  const loading = status === "loading";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session || !session.user) {
    Router.push("/login");
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center w-full">
        <div className="flex flex-col justify-center items-center w-[50%]">
          <div className="profile-image mt-10 bg-white w-40 h-40 rounded-full"></div>
          <div className="username py-2">{session.user.username}</div>
        </div>
        <div className="flex flex-col w-[50%]">
          <div className="flex justify-evenly mt-10">
            <div className="flex flex-col justify-center items-center">
              <div className="font-semibold">100</div>
              <div>Follower</div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className="font-semibold">10000</div>
              <div>Following</div>
            </div>
          </div>
          <div className="pl-3 my-5">bioooo....</div>
          <Link
            href={"/edit-profile"}
            className="p-2 sm:p-4 bg-purp rounded-full flex justify-center my-5"
          >
            Edit Profile
          </Link>
        </div>
      </div>
      <button onClick={handleLogout} className="p-4 bg-purp rounded-full m-5">
        logout
      </button>
    </>
  );
}
