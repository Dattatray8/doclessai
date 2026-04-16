import Link from 'next/link'
import React from 'react'

const CTA = () => {
    return (
        <section className='max-w-280 mx-auto px-5 py-18'>
            <div className='cta-inner'>
                <h2 className='cta-h2'>Your users deserve<br />instant answers.</h2>
                <p className="cta-sub">
                    Add a context-aware AI assistant to your app today.
                </p>
                <div className='flex gap-2.5 justify-center flex-wrap'>
                    <Link href="/docs" className="btn-primary">Read the docs →</Link>
                    <Link
                        href="https://www.npmjs.com/package/@doclessai/sdk"
                        target="_blank"
                        className="btn-outline"
                    >View on npm</Link>
                </div>
            </div>
        </section>
    )
}

export default CTA
