"use client";

import { Button } from "@nextui-org/react";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link } from "@nextui-org/react"; 

export default function Home() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  })

  return (
    <div className="bg-fixed h-screen inset-0 overflow-auto h-screen bg-gradient-to-r from-[#481d80] to-[#000000]">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-6xl md:text-8xl font-bold text-[#e7c9dc] mb-4 animate-[pulse_4s_cubic-bezier(0.4,_0,_0.6,_1)_infinite]">
          Welcome to NoteKan
        </h1>
        <p className="text-lg md:text-xl font-bold text-white mb-8">
         One-Click AI Summaries: Transform Talks into Text Instantly!
        </p>
        <Link href="/login">
          <Button className="bg-[#e7c9dc] hover:bg-white-200 text-black font-bold py-2 px-4 rounded">
            Get Started
          </Button>
        </Link>
        

        {isVisible && (
          <div className="absolute bottom-8 flex justify-center">
            <FontAwesomeIcon
              icon={faAngleDown}
              className="text-white text-4xl animate-bounce mt-4 items-end"
            />
          </div>
        )}

        <footer className="absolute bottom-0 mb-4 text-white">
          {" "}
          © 2024 NoteKan{" "}
        </footer>
      </div>

      <div className="overflow-auto h-screen">
        <div className="h-screen flex flex-col items-center">
          <h1 className="text-6xl md:text-7xl font-bold text-white mt-4">
            About Us
          </h1>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">Our Story</h2>
          <p className="text-gray-200 mb-6 mx-auto px-16">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut mattis
            magna consectetur ex gravida commodo. Curabitur id turpis vel massa
            cursus aliquet convallis ac magna. Proin sed libero eu tortor
            ultrices porta tincidunt eget lacus. Ut dictum euismod tincidunt.
            Duis posuere finibus urna, ut iaculis urna vehicula id. Phasellus
            rutrum molestie lectus, at malesuada quam hendrerit a. Nulla non
            risus eget magna varius vestibulum eu a mi.
          </p>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-200 mb-6 mb-6 mx-auto px-16">
            Phasellus rutrum molestie lectus, at malesuada quam hendrerit a.
            Nulla non risus eget magna varius vestibulum eu a mi. Duis in elit
            velit. Vestibulum sodales porttitor eros, tristique pretium metus
            interdum eu. Sed quis dui quis augue scelerisque ullamcorper
            consectetur nec velit. Curabitur id sapien a purus consectetur
            cursus a ac sapien. Ut odio libero, pulvinar nec blandit sed,
            efficitur ac arcu. Sed dui ligula, vulputate et metus quis, pretium
            accumsan justo.
          </p>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">Our Team</h2>
          <p className="text-gray-200 mb-6 mb-6 mx-auto px-16">
            In enim orci, bibendum id ullamcorper et, interdum quis arcu. Nulla
            a purus pulvinar, pulvinar erat in, tempor elit. Integer cursus
            ornare lectus. Praesent diam ligula, ultrices et molestie nec,
            pulvinar vitae magna. Vestibulum eget mollis nisi, in fermentum
            turpis. Nulla purus nibh, tincidunt vitae fermentum ac, lacinia non
            magna. Mauris sollicitudin sagittis mauris vulputate gravida. Etiam
            id rhoncus purus, quis tincidunt nunc. Cras malesuada sem mi, at
            auctor justo placerat a.
          </p>
        </div>
      </div>
    </div>
  );
}
