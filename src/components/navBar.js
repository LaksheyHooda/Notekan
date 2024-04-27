import { Link } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <nav
      className={`fixed top-0 w-full z-10 transition-colors duration-300 ${
        isScrolled
          ? "bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto py-4 px-6 flex justify-between items-center">
        <Link className="text-white font-bold text-xl" href="/">
          NoteKan
        </Link>

        <div className="hidden md:block">
          <ul className="flex space-x-4">
            <li>
              <Link className="text-white hover:text-gray-400" href="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="text-white hover:text-gray-400" href="/about">
                About
              </Link>
            </li>
            <li>
              <Link className="text-white hover:text-gray-400" href="/contact">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
