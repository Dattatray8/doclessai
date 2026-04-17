'use client'

import CTA from "@/components/landing/CTA";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import WorkWithTech from "@/components/landing/WorkWithTech";
import Working from "@/components/landing/Working";

export default function Home() {
    return (
        <div>
            <Hero />
            <WorkWithTech />
            <Working />
            <Features />
            <CTA />
            <Footer />
        </div>
    );
}
