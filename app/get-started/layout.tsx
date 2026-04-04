import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Get Started With DoclessAI",
};

export default function DocumentationLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
        </>
    );
}
