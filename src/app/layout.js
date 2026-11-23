
import "./globals.css";
import AIAssistant from "./AIAssistant";

export const metadata = {
  title: "Onkur",
  description:
    "Discover opportunities, develop your skills, and connect with a community that helps you grow.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <AIAssistant />
      </body>
    </html>
  );
}
