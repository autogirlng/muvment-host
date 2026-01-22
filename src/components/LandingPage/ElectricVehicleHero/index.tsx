// import Button from "@repo/ui/button";
import Image from "next/image";
import Link from "next/link";



function ElectricalVehicleHero() {
    return (
        <section className="relative bg-white flex  flex-col lg:flex-row items-stretch overflow-hidden">

            {/* LEFT SIDE: Image Section - Now visible on all screens */}
            <div className="hidden lg:block relative lg:w-1/2 lg:min-h-screen">
                <img
                    src="/images/electric.jpg"
                    alt="White Electric Vehicle"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
                {/* Abstract geometric overlay */}
                <div className="absolute bottom-0 right-0 w-64 h-64">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current opacity-90">
                        <polygon points="100,0 100,100 0,100" />
                    </svg>
                </div>
            </div>




            {/* RIGHT SIDE: Content Section */}
            <div className="relative w-full lg:w-1/2 bg-white flex items-center justify-center  lg:justify-start px-6 py-12 lg:px-16 xl:px-24">

                {/* Top Decorative Triangle - Kept hidden on mobile for cleaner text flow */}
                <div className="absolute top-0 left-0 w-32 h-32 hidden lg:block">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-blue-700 fill-current">
                        <polygon points="0,0 100,0 0,100" />
                    </svg>
                </div>

                <div className="max-w-xl">
                    {/* Accent Line */}
                    <div className="w-16 h-1.5 bg-blue-700 mb-6 lg:mb-8"></div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl text-[blue] font-bold  leading-tight">
                        Earn with <br />
                        <span className="text-blue-700">Electric Vehicles.</span> <br />
                        <span className="text-slate-500 text-xl md:text-3xl lg:text-4xl">Without Owning One.</span>
                    </h1>

                    <div className="mt-6 lg:mt-8 space-y-6 text-slate-600 text-base md:text-lg leading-relaxed">
                        <p>
                            <strong className="text-slate-900">Muvment by Autogirl</strong> gives drivers and transport operators access to income-generating vehicles through flexible daily and shift-based plans.
                        </p>

                        <div className="bg-black p-5 lg:p-6 rounded-sm text-white shadow-lg">
                            <p className="text-sm md:text-base leading-relaxed">
                                Our fleet is pre-registered on major ride-hailing platforms, so you can start earning immediately. We handle the vehicle, insurance, and support.
                            </p>
                        </div>

                        <p className="italic text-sm md:text-base">
                            If you’re ready to earn consistently, operate smarter, and stay flexible, Muvment is built for you.
                        </p>
                    </div>

                    <div className="mt-8 lg:mt-10">
                        <Link href="/earn" className="group bg-[blue] inline-flex w-full sm:w-auto justify-center items-center gap-3 bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 px-8 rounded shadow-md transition-all transform hover:-translate-y-1">
                            <span className="text-white"> Join today. Start earning tomorrow.</span>
                            <span className="group-hover:translate-x-1 text-white transition-transform">→</span>
                        </Link>
                    </div>

                    {/* Footer dots decoration */}
                    <div className="mt-10 lg:mt-12 flex gap-2">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className={`w-3 h-3 rounded-full ${i < 5 ? 'bg-blue-700' : 'bg-blue-200'}`}></div>
                        ))}
                    </div>
                </div>

                {/* Bottom Decorative Triangle */}
                <div className="absolute bottom-0 right-0 w-24 h-24 hidden lg:block">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-slate-100 fill-current">
                        <polygon points="100,0 100,100 0,100" />
                    </svg>
                </div>
            </div>
        </section>
    );
}

export { ElectricalVehicleHero };
