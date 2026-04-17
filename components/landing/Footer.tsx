import Link from "next/link"

type Tab = {
    title: string;
    href: string;
}

type FooterTypes = {
    title: string;
    tabs: Tab[];
}

const Footertabs: FooterTypes[] = [
    {
        title: "Product",
        tabs: [
            { title: "Features", href: "#features" },
            { title: "Documentation", href: "/docs" },
            { title: "Dashboard", href: "/user" }
        ]
    },
    {
        title: "Developers",
        tabs: [
            { title: "Github", href: "https://github.com/Dattatray8/doclessai-sdk" },
            { title: "npm", href: "https://www.npmjs.com/package/@doclessai/sdk" },
            { title: "Quickstart", href: "/docs#quickstart" }
        ]
    },
    {
        title: "Legal",
        tabs: [
            { title: "Privacy Policy", href: "/privacy" },
            { title: "Terms of Service", href: "/privacy#terms" }
        ]
    }
]

const Footer = () => {
    return (
        <footer>
            <div className="footer-inner">
                <div className="footer-top">
                    <div className="footer-brand">
                        <Link href={'/'}>DoclessAI</Link>
                        <p>Context-aware AI assistants for any application. Define features,
                            let the AI handle the rest.</p>
                    </div>
                    {Footertabs.map((tab, idx) => (
                        <div className="footer-col" key={idx}>
                            <h4>{tab.title}</h4>
                            <ul>
                                {tab.tabs.map((subtab, subidx) => (
                                    <li key={subidx}>
                                        <Link href={subtab.href}>{subtab.title}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="footer-bottom">
                    <span>© 2025 DoclessAI · Built by <Link href={"https://github.com/Dattatray8"} className="text-(--accent)">Dattatray</Link></span>
                    <div className="footer-links-row">
                        <Link href={"https://github.com/Dattatray8/doclessai-sdk"}>Github</Link>
                        <Link href={"https://www.npmjs.com/package/@doclessai/sdk"}>npm</Link>
                        <Link href={"/privacy"}>Privacy</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
