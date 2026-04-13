import React from 'react'

type Steps = {
    id: string;
    icon: string;
    title: string;
    desc: string;
}

const Working = () => {
    const steps: Steps[] = [
        {
            id: "01",
            icon: "🗂",
            title: "Create your app",
            desc: "Register in the dashboard, give your app a name, describe its purpose, and get your App Key."
        },
        {
            id: "02",
            icon: "✏️",
            title: "Define features",
            desc: "Add your app's features and descriptions as JSON. The AI uses this as its knowledge base."
        },
        {
            id: "03",
            icon: "📦",
            title: "Install the SDK",
            desc: "npm install @doclessai/sdk. Add ChatWidget or use DoclessClient for a custom UI."
        },
        {
            id: "04",
            icon: "🤖",
            title: "Users get answers",
            desc: "Your users ask questions through the chat widget. The AI answers based on your defined features."
        }
    ]

    return (
        <section className='max-w-280 mx-auto px-5 py-18'>
            <span className='section-tag'>How It Works</span>
            <h2 className='section-h2'>
                From install to AI assistant<br />in four steps.
            </h2>
            <p className='section-sub'>
                Define your app&apos;s features. We handle the intelligence layer.
            </p>
            <div className='steps-wrap'>
                {steps.map((step) => (
                    <div key={step.id} className='group step-card'>
                        <div className='step-num'>{step.id}</div>
                        <div className='step-icon'>{step.icon}</div>
                        <div className='step-title'>{step.title}</div>
                        <div className='step-desc'>{step.desc}</div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Working
