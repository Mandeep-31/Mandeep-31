import type { Metadata } from "next";
import Navbar from "@/components/portfolio/Navbar";
import ContactForm from "@/components/portfolio/ContactForm";

export const metadata: Metadata = {
  title: "Get in touch — Mandeep Acharya",
  description:
    "Send Mandeep a message — about an idea, a project, or anything in between. He’ll get back to you shortly.",
};

export default function Contact() {
  return (
    <div className="contact-page">
      <Navbar />
      <main>
        <ContactForm />
      </main>
    </div>
  );
}