import "@/styles/globals.css";
import { useEffect, useState } from 'react';
import { ThemeProvider } from "next-themes";
import { useWindowWidth} from '@react-hook/window-size/throttled'
import Brand from "@/components/Brand";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

export default function App({ Component, pageProps:{ session, ...pageProps } }) {
  const [isMounted, setIsMounted] = useState(false);
  const onlyWidth = useWindowWidth();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  
  return (
  <ThemeProvider attribute="class">
    <Head>
      <meta name="viewport" content="width=device-width" initial-scale="1.0"/>
    </Head>
    <SessionProvider session={session}>
    <div className={isMounted && onlyWidth>640?(""):("p-3 w-full sticky top-0 bg-black")}>
    {isMounted && onlyWidth <= 640 && <Brand />}
    </div>
   
    <Component {...pageProps} />
    </SessionProvider>
  </ThemeProvider>
)
}
