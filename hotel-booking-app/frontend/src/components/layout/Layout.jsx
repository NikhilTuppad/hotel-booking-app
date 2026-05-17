import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen relative overflow-x-hidden bg-slate-50">
            {/* Background Blobs for Premium SaaS Feel */}
            <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-brand/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob z-0 pointer-events-none will-change-transform"></div>
            <div className="fixed top-[20%] right-[-10%] w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob z-0 pointer-events-none hidden md:block will-change-transform" style={{ animationDelay: '2s' }}></div>
            <div className="fixed bottom-[-20%] left-[20%] w-96 h-96 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob-slow z-0 pointer-events-none hidden lg:block will-change-transform" style={{ animationDelay: '4s' }}></div>

            <div className="relative z-10 flex flex-col min-h-screen w-full">
              <Header/>
              <div className="flex-1 w-full">
                  <Outlet/>
              </div>
            </div>
        </div>
    )
}