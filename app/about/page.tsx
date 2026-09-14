import type { Metadata } from "next";
import Navbar from "@/components/portfolio/Navbar";
import AboutStory from "@/components/portfolio/AboutStory";

export const metadata: Metadata = {
  title: "The Person — Mandeep Acharya",
  description:
    "Where Mandeep Acharya studies, what he's learning, and the person behind the build — from Kathmandu, Nepal.",
};

export default function About() {
  return (
    <div className="about-page">
      <Navbar />
      <main>
        <AboutStory />
      </main>
    </div>
  );
}