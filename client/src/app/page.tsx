"use client";

import Header from "./components/header";
import Content from "./components/content";
import Footer from "./components/footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Header />
      <Content />
      <Footer />
    </main>
  );
}
