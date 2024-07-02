import "@/styles/globals.css";
import { useEffect, useState } from 'react';
import { ThemeProvider } from "next-themes";
import { useWindowWidth} from '@react-hook/window-size/throttled'
import Brand from "@/components/Brand";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps:{ session, ...pageProps } }) {
  const [isMounted, setIsMounted] = useState(false);
  const onlyWidth = useWindowWidth();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  

  return (
  <ThemeProvider attribute="class">
    <SessionProvider session={session}>
    <div className={isMounted && onlyWidth>639?(""):("p-3 w-full sticky top-0 bg-black")}>
    {isMounted && onlyWidth <= 639 && <Brand />}
    </div>
   
    <Component {...pageProps} />
    </SessionProvider>
  </ThemeProvider>
)
}
