'use client'

import SideBar from "@/components/Admin/SideBar/SideBar"
import NutsBackgroundParticles from "@/components/ui/BackgroundPattern"


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex min-h-screen w-full">
            <div className="absolute inset-0 z-10 h-screen">
                <NutsBackgroundParticles />
            </div>
            <aside className="sticky top-0 right-0  h-screen flex justify-center items-center z-70 md:mt-15">
                <SideBar />
            </aside>
            <main className="w-full">
                {children}
            </main>
        </div>
    )
}