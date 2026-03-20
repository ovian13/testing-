import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-background flex flex-col items-center pt-32 pb-24 px-6 md:px-12">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-breathe" />
      
      {/* Navigation Bar (Glassmorphic) */}
      <nav className="fixed top-6 left-6 right-6 z-50 flex items-center justify-between max-w-5xl px-8 py-4 glass-panel rounded-full shadow-golden-glow animate-fade-in-down">
        <div className="text-xl font-newsreader font-bold tracking-tight text-on-surface">EAKALAIVA</div>
        <div className="hidden md:flex items-center gap-8 font-spaceGrotesk text-sm tracking-widest text-secondary">
          <Link href="/roadmap" className="hover:text-primary transition-colors">ROADMAP</Link>
          <Link href="/leaderboard" className="hover:text-primary transition-colors">LEADERBOARD</Link>
          <Link href="/profile" className="hover:text-primary transition-colors">PROFILE</Link>
          <Link href="/portal" className="hover:text-primary transition-colors">PORTAL</Link>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-5 py-2 text-sm font-spaceGrotesk font-semibold text-primary-dim hover:text-primary transition-colors border border-outline-variant/30 hover:bg-surface-bright rounded-none hidden sm:block hover-glow-border">
            SIGN IN
          </Link>
          <Link href="/register" className="px-5 py-2 text-sm font-spaceGrotesk font-semibold text-primary-on bg-gradient-gold hover:shadow-golden-glow transition-all rounded-none animate-glow-pulse">
            START JOURNEY
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <section className="relative z-10 max-w-4xl text-center mt-20 flex flex-col items-center">
        <div className="inline-block px-4 py-1.5 mb-8 border border-outline-variant/30 bg-surface-container/50 font-spaceGrotesk text-xs tracking-[0.2em] text-secondary uppercase animate-fade-in-up delay-2">
          The Architectural Blueprint
        </div>
        
        <h1 className="text-6xl md:text-8xl font-newsreader tracking-[-0.02em] leading-[1.1] text-on-surface mb-8 animate-fade-in-up delay-3">
          Silence the <span className="gold-gradient-text italic">Noise.</span><br />
          Prove the <span className="gold-gradient-text italic">Work.</span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl font-manrope text-on-surfaceVariant leading-relaxed mb-12 animate-fade-in-up delay-5">
          If you cannot change the college you came from, change what you can prove. 
          A specialized network for the next generation of elite engineers—authoritative, precise, and unapologetically meritocratic.
        </p>

        {/* Action Area */}
        <div className="flex flex-col sm:flex-row items-center gap-6 animate-fade-in-up delay-7">
          <Link href="/register" className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-gold text-primary-on font-spaceGrotesk font-bold tracking-widest transition-all hover:shadow-golden-glow hover:scale-[1.02] animate-glow-pulse">
            <span>INITIALIZE PROFILE</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          
          <Link href="/roadmap" className="px-8 py-4 font-spaceGrotesk font-bold tracking-widest text-secondary hover:text-primary hover:bg-surface-bright border border-outline-variant/30 transition-all hover-glow-border">
            VIEW ROADMAP
          </Link>
        </div>
      </section>

      {/* ===== HOW OUR MODEL WORKS ===== */}
      <section className="relative z-10 w-full max-w-6xl mt-40 mb-8">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in-up delay-1">
          <div className="inline-block px-4 py-1.5 mb-6 border border-outline-variant/30 bg-surface-container/50 font-spaceGrotesk text-xs tracking-[0.2em] text-secondary uppercase animate-typewriter delay-2">
            SYS_PROTOCOL: THE MODEL
          </div>
          <h2 className="text-4xl md:text-6xl font-newsreader tracking-[-0.02em] leading-tight text-on-surface mb-4">
            How <span className="gold-gradient-text italic">Eakalaiva</span> Works
          </h2>
          <p className="max-w-xl mx-auto font-manrope text-on-surfaceVariant text-base leading-relaxed">
            A four-phase protocol designed to surface real talent. No resumes. No fluff. Only verified proof of engineering capability.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-0">
          {/* Progressive arrow connector (desktop only) */}
          <div className="hidden md:block absolute top-[-4px] left-[12.5%] right-[12.5%] h-6 z-20">
            <svg className="w-full h-full" viewBox="0 0 900 24" fill="none" preserveAspectRatio="xMidYMid meet">
              {/* Base track line */}
              <line x1="0" y1="12" x2="900" y2="12" stroke="rgba(77, 70, 55, 0.3)" strokeWidth="1" />
              {/* Animated gold progress line */}
              <line x1="0" y1="12" x2="900" y2="12" stroke="url(#arrowGrad)" strokeWidth="1.5" className="animate-expand-width delay-5" />
              {/* Arrowheads above each box center */}
              <polygon points="0,5 12,12 0,19" fill="rgba(230, 195, 100, 0.35)" />
              <polygon points="294,5 306,12 294,19" fill="rgba(230, 195, 100, 0.35)" />
              <polygon points="594,5 606,12 594,19" fill="rgba(230, 195, 100, 0.35)" />
              <polygon points="888,5 900,12 888,19" fill="rgba(230, 195, 100, 0.5)" />
              <defs>
                <linearGradient id="arrowGrad" x1="0" y1="0" x2="900" y2="0">
                  <stop offset="0%" stopColor="rgba(230, 195, 100, 0.5)" />
                  <stop offset="100%" stopColor="rgba(201, 168, 76, 0.3)" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {[
            {
              id: "01",
              title: "Initialize",
              subtitle: "CREATE YOUR IDENTITY",
              desc: "Register and build your engineering profile. Declare your track—backend, ML, systems, security—and set your trajectory.",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="square" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                </svg>
              )
            },
            {
              id: "02",
              title: "Build",
              subtitle: "FOLLOW THE ROADMAP",
              desc: "Progress through structured learning paths. Each node is a mastery checkpoint—algorithms, system design, architecture, and beyond.",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="square" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
              )
            },
            {
              id: "03",
              title: "Verify",
              subtitle: "SUBMIT PROOF OF WORK",
              desc: "Ship real projects, contribute to open source, solve architectural challenges. Every claim is peer-verified and permanently recorded.",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="square" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              )
            },
            {
              id: "04",
              title: "Ascend",
              subtitle: "GET DISCOVERED",
              desc: "Rise through the meritocratic leaderboard. Top engineers surface directly to companies seeking verified, battle-tested talent.",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="square" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              )
            }
          ].map((step, i) => (
            <div key={step.id} className={`relative flex flex-col items-center text-center px-6 py-8 animate-fade-in-up delay-${3 + i}`}>
              {/* Step Node */}
              <div className={`relative z-10 w-[104px] h-[104px] border flex flex-col items-center justify-center mb-8 transition-all duration-700 group cursor-default
                ${i === 0 
                  ? 'bg-primary/10 border-primary shadow-golden-glow animate-glow-pulse' 
                  : 'bg-surface-container-low border-outline-variant/30 hover:border-primary/50 hover:bg-surface-container hover:shadow-golden-glow'
                }`}>
                <div className="text-primary mb-1 transition-transform duration-500 group-hover:scale-110">
                  {step.icon}
                </div>
                <span className="font-spaceGrotesk text-[10px] tracking-widest text-secondary">{step.id}</span>
              </div>

              {/* Step Content */}
              <h3 className="text-2xl font-newsreader text-on-surface mb-2">{step.title}</h3>
              <div className="font-spaceGrotesk text-[10px] tracking-[0.2em] text-primary uppercase mb-4">{step.subtitle}</div>
              <p className="font-manrope text-sm text-on-surfaceVariant leading-relaxed max-w-[240px]">
                {step.desc}
              </p>

              {/* Mobile connector arrow (mobile only) */}
              {i < 3 && (
                <div className="md:hidden mt-6 text-outline-variant/40">
                  <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="square" d="M12 5v14m0 0l-4-4m4 4l4-4" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA for the section */}
        <div className="text-center mt-16 animate-fade-in-up delay-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 glass-panel hover-glow-border cursor-default">
            <div className="w-2 h-2 bg-primary rounded-full animate-glow-pulse" />
            <span className="font-spaceGrotesk text-xs tracking-widest text-secondary">
              MERITOCRACY_ENGINE — ZERO GATEKEEPING, PURE SIGNAL
            </span>
          </div>
        </div>
      </section>

      {/* Lower Decorative Elements */}
      <div className="mt-32 w-full max-w-5xl border-t border-outline-variant/20 pt-12 flex justify-between items-center font-spaceGrotesk text-xs text-outline tracking-widest animate-fade-in-up delay-10">
        <div className="animate-typewriter delay-12">SYS_VERSION: 1.0.0</div>
        <div className="hidden sm:block animate-shimmer px-4 py-2">SECURE_CHANNEL_ACTIVE</div>
        <div className="animate-border-glow border border-transparent px-3 py-1">[ STATUS: ONLINE ]</div>
      </div>
    </main>
  );
}
