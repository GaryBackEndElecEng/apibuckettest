import TestPagev3 from "@component/TestPagev3"
import Link from "next/link";


export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-row p2">
        <div className="flex flex-col my-3 px-3 rounded-full px-3 bg-slate-800 text-white shadow shadow-orange-800">
          <Link href={"/createBlog"}>CreateBlog</Link>
        </div>
        <div className="flex flex-col my-3 px-3 rounded-full px-3 bg-slate-800 text-white shadow shadow-orange-800">
          <Link href={"/posts"}>posts</Link>
        </div>
        <div className="flex flex-col my-3 px-3 rounded-full px-3 bg-slate-800 text-white shadow shadow-orange-800">
          <Link href={"/blogs"}>blogs</Link>
        </div>
      </div>

    </main>
  )
}





