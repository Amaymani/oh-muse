import "@/styles/globals.css";
import { useEffect, useState } from 'react';
import { ThemeProvider } from "next-themes";
import { useWindowWidth} from '@react-hook/window-size/throttled'
import Brand from "@/components/Brand";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import Footer from "@/components/Footer";

import { useRouter } from 'next/router';

export default function App({ Component, pageProps:{ session, ...pageProps } }) {
  const [isMounted, setIsMounted] = useState(false);
  const onlyWidth = useWindowWidth();
  const router=useRouter()

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
   
    <Component key={router.asPath} {...pageProps} />
    <Footer/>
    </SessionProvider>
  </ThemeProvider>
)
}
