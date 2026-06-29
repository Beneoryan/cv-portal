import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "CV Portal - IJEF",
  description: "Portal CV Kandidat untuk matching job Jepang",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-gray-50 min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
