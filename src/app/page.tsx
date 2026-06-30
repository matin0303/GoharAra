"use client"
import { JSX } from "react";
import Header from "../components/Header/Header"
import Main from "@/components/Main/Main";
import Footer from "@/components/Footer/Footer";

export default function App():JSX.Element{
 
  return(
      <div className="w-full px-7 max-sm:px-0"> 
        <main className="max-w-[96rem] mx-auto">
          <Main/>
        </main>       
      </div>
  )
}