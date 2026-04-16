'use client'

import CTA from "@/components/CTA";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import WorkWithTech from "@/components/WorkWithTech";
import Working from "@/components/Working";

export default function Home() {
    return (
        <div>
            <Hero />
            <WorkWithTech />
            <Working />
            <Features />
            <CTA />
        </div>
    );
}
