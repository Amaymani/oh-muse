
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();

  if (loading) {
    return <div>Loading...</div>;  // Or a custom loading component
  }
  if (!session || !session.user) {
    router.push("/login");
  }


  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center w-auto">
        <div className="bg-yell w-[48rem]">h</div>
      </div>
    </>
  );
}
