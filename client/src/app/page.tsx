"use client";
import React from "react";
import { signIn } from "next-auth/react";
import Waves from "@/components/waves";

const HomePage = () => {
  return (
    <div>
      <div className="h-[calc(100vh-7rem)] flex justify-center items-center text-center">
        <div>
          <h1 className="text-white text-5xl mb-4">Chat with your PDF</h1>
          <p className="text-slate-400 mb-16">
            Upload a PDF file to start chatting with its content.
          </p>
          <button
            className="bg-white text-black px-4 py-2 rounded-md mt-2"
            onClick={() => signIn()}
          >
            Chat now
          </button>
        </div>
        
      </div>
      <Waves />
    </div>
  );
};

export default HomePage;
