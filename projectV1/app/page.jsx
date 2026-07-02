import Header from "@/components/custom/Header";
import Hero from "@/components/custom/Hero";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center">
        <Hero />
      </main>
    </div>
  );
}
