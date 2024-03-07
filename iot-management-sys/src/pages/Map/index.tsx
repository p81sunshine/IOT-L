import dynamic from "next/dynamic";
const MyAwesomeMap = dynamic(() => import("@/components/Map"), { ssr: false });

export default function inicio() {
  return (
    <>
      <MyAwesomeMap />
    </>
  );
}
