import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Notekan",
  description: "Dope project about something",
};

export default function RootLayout({ children }) {
  return (
    <div className="inline-block max-w-lg text-center">
      {children}
    </div>
  );
}
