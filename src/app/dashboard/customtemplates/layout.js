import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Notekan",
  description: "Dope project about something",
};

export default function RootLayout({ children }) {
  return (
    <div className="inline-block min-w-screen w-screen text-center justify-center">
      {children}
    </div>
  );
}
