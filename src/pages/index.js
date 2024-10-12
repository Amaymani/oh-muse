
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
        <div className="bg-yell w-[60rem] mx-2">h</div>
      </div>
    </>
  );
}
