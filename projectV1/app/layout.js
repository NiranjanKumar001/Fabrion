// import Header from "@/components/custom/Header";
import "./globals.css";
import Provider from "./provider";
import ConvexClientProvider from "./ConvexClientProvider";
// import NetworkWarning from "@/components/custom/NetworkStatus";
import NetworkWarningToast from "@/components/custom/NetworkWarningToast";

export const metadata = {
  title: "Fabrion",
  description: "just some creation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ConvexClientProvider>
          <Provider>
           {children}
           <NetworkWarningToast/>
           </Provider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
