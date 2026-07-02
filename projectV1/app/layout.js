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
    <html lang="en" suppressHydrationWarning className="dark">
      <body 
        suppressHydrationWarning 
        className="bg-[#030303] text-zinc-100 min-h-screen relative antialiased selection:bg-cyan-500/30 selection:text-cyan-200"
      >
        {/* Glow effects & Grid system */}
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          
          {/* Decorative radial gradients (glowing blobs) */}
          <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[130px] animate-pulse duration-[8000ms]"></div>
          <div className="absolute top-[-20%] right-[10%] w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[140px]"></div>
          <div className="absolute top-[-30%] left-[45%] w-[800px] h-[400px] rounded-full bg-blue-500/5 blur-[120px]"></div>
        </div>

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
