import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Notekan",
  description: "Dope project about something",
};

export default function RootLayout({ children }) {
  return (
    <div className="flex w-screen min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      {children}
    </div>
  );
}
