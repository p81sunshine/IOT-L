import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "antd/dist/reset.css";
import { MyLayout } from "@/components/Layout";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && !router.pathname.startsWith("/User")) {
      router.push("/User/login");
    }
  }, [router.pathname]);
  return router.pathname.startsWith("/User") || router.pathname === "/" ? (
    <Component {...pageProps} />
  ) : (
    <MyLayout>
      <Component {...pageProps} />
    </MyLayout>
  );
}
