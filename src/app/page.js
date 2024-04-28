"use client";

import { Button } from "@nextui-org/react";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import NavBar from "@/components/navBar";

export default function Home() {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-fixed h-screen inset-0 overflow-auto h-screen bg-gradient-to-r from-[#481d80] to-[#000000]"
      >
        <NavBar />
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-6xl md:text-8xl font-bold text-[#e7c9dc] mb-4 animate-[pulse_4s_cubic-bezier(0.4,_0,_0.6,_1)_infinite]">
            Welcome to NoteKan
          </h1>
          <div className="flex flex-wrap justify-between">
            <p className="text-lg md:text-xl font-bold text-white mb-8">
              We hate
            </p>
            <p className="text-lg md:text-xl font-bold text-white mb-8 text-glitch text-glitch-fast">
              &nbsp;Confluence
            </p>
            <p className="text-lg md:text-xl font-bold text-white mb-8">
              &nbsp;too.
            </p>
          </div>

          <Link href="/login">
            <Button className="bg-[#e7c9dc] hover:bg-white-200 text-black font-bold py-2 px-4 rounded">
              Get Started
            </Button>
          </Link>

          <footer className="absolute bottom-0 mb-4 text-white">
            {" "}
            © 2024 NoteKan{" "}
          </footer>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
