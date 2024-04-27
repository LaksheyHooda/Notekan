import { Inter } from "next/font/google";
import LeftNavBar from "@/components/lefthandnavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Notekan",
    description: "Dope project about something",
};

export default function RootLayout({ children }) {
    return (
        <section>
            <LeftNavBar className="z-10" />
            <div className="inline-block max-w-lg text-center justify-center">
                {children}
            </div>
        </section>
    );
}
