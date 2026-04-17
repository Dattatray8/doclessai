type Feature = {
    icon: string
    title: string
    description: string
    className: string
}

const Features = () => {
    const features: Feature[] = [
        {
            icon: "🧠",
            title: "Context-Aware AI",
            description: "The assistant answers based on the features you define — grounded, specific responses for your app. Not generic chatbot answers.",
            className: "fi-v"
        },
        {
            icon: "⚡",
            title: "Drop-In Widget",
            description: "One import, one JSX tag. ChatWidget handles the full UI — chat panel, markdown, image support, and toast notifications.",
            className: "fi-b"
        },
        {
            icon: "🖼",
            title: "Multimodal Responses",
            description: "Add image URLs to your features. The assistant returns relevant images alongside text when users ask about visual parts of your app.",
            className: "fi-g"
        },
        {
            icon: "♻️",
            title: "Real-Time Context Sync",
            description: "Edit or add features in the dashboard — the AI's knowledge updates instantly, no redeploy needed.",
            className: "fi-v"
        },
        {
            icon: "🔧",
            title: "Headless SDK",
            description: "Want full control over the UI? Use DoclessClient directly. Build your own chat interface, powered by our intelligence layer.",
            className: "fi-b"
        },
        {
            icon: "🎯",
            title: "TypeScript First",
            description: "Complete TypeScript types ship with the package. Autocomplete, type safety, zero guessing.",
            className: "fi-a"
        },
    ]

    return (
        <section className='max-w-280 mx-auto px-5 py-18' id='features'>
            <span className='section-tag'>Features</span>
            <h2 className="section-h2">What DoclessAI gives you.</h2>
            <p className="section-sub">
                Ship an AI-powered assistant in your app without building any AI
                infrastructure yourself.
            </p>
            <div className="feat-grid">
                {features.map((feat, i)=>(
                    <div key={i} className={`feat-card ${feat.icon === "🧠" ? "hl" : ""}`}>
                        <div className={`feat-icon ${feat.className}`}>{feat.icon}</div>
                        <div className="feat-title">{feat.title}</div>
                        <div className="feat-desc">{feat.description}</div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Features
