

function Feedback() {
    return (
        <section className="py-20 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="text-4xl font-bold mb-6">Feedback About Their Experience With Us</h2>
                <p className="text-gray-500 mb-8">Read testimonials from our clients. See how our programs have made a difference in their lives.</p>
                <div className="flex gap-4">
                    <button className="p-3 border rounded-md hover:bg-gray-100 transition">←</button>
                    <button className="p-3 bg-orange-500 text-white rounded-md">→</button>
                </div>
            </div>

            <div className="bg-white border-2 border-orange-400 rounded p-6 flex gap-6 relative shadow-lg">
                <img src="/signle2.jpg" className="w-24 h-24 rounded-lg object-cover" alt="User" />
                <div>
                    <h4 className="font-bold text-lg text-gray-800">Muna Abdi</h4>
                    <p className="text-xs text-gray-500 mb-2">Business women</p>
                    <div className="flex text-orange-400 mb-4">{"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}</div>
                    <p className="text-gray-600 text-sm italic">"Excellent programs! The team was punctual, thoroughn. Highly recommend!"</p>
                </div>
                <div className="absolute top-8 right-8 text-orange-400 opacity-30 text-6xl font-serif">"</div>
            </div>
        </section>
    );
}

export default Feedback;