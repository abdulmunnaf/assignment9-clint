import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "DriveFleet | Premium Car Rental & Luxury Fleet Platform",
  description:
    "Experience pure performance and luxury with DriveFleet. Explore high-performance sports cars, luxury SUVs, and electric sedans with instant online booking.",
  keywords: "car rental, exotic cars, luxury vehicle rental, DriveFleet, rent Tesla, rent Porsche",
  openGraph: {
    title: "DriveFleet - Premium Car Rental Platform",
    description: "Book high-end cars, track live availability, and manage your fleet rentals effortlessly.",
    url: "https://assignment-9-beta.vercel.app",
    siteName: "DriveFleet",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col transition-colors duration-300">
        <ThemeProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: "#0f172a",
                color: "#f8fafc",
                border: "1px solid #334155",
                borderRadius: "0.75rem",
                padding: "12px 18px",
                fontSize: "14px",
              },
            }}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
