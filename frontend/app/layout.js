// import Header from "@/components/custom/Header";
import "./globals.css";
import Provider from "./provider";
import ConvexClientProvider from "./ConvexClientProvider";
import Header from "@/components/custom/Header";

export const metadata = {
  title: "Fabrion",
  description: "just some creation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ConvexClientProvider>
          <Provider>
          <Header />
            {children}
          </Provider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
