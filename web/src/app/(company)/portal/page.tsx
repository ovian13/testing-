import Link from "next/link";
import Image from "next/image";

export default function EmployerPortal() {
  const candidates = [
    { name: "Karthik N.", role: "Systems Architect", match: "98%", rep: 1840, status: "AVAILABLE" },
    { name: "Arjun V.", role: "Backend Engineer", match: "94%", rep: 2450, status: "INTERVIEWING" },
    { name: "Sarah K.", role: "Machine Learning", match: "89%", rep: 2310, status: "AVAILABLE" },
    { name: "Emily R.", role: "Security Analyst", match: "82%", rep: 1950, status: "OFFERED" }
  ];

  return (
    <main className="min-h-screen relative bg-surface-lowest pt-32 pb-24 px-6 md:px-12 xl:px-32">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[140px] mix-blend-screen pointer-events-none animate-breathe" />

      {/* Top Navigation Back Link */}
      <nav className="absolute top-12 left-6 md:left-12 z-50 animate-fade-in-left">
        <Link href="/" className="flex items-center gap-2 text-secondary hover:text-primary transition-colors font-spaceGrotesk text-sm tracking-widest">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          RETURN TO HUB
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-12">
        
        {/* Header section with asymmetric layout */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-8 border-b border-outline-variant/30 animate-fade-in-up delay-1">
          <div>
            <div className="inline-block px-4 py-1.5 mb-6 border border-outline-variant/30 bg-surface-container/50 font-spaceGrotesk text-xs tracking-[0.2em] text-primary uppercase animate-typewriter delay-2">
              EMPLOYER_PORTAL // RECRUITMENT_DASHBOARD
            </div>
            <h1 className="text-5xl md:text-7xl font-newsreader tracking-[-0.02em] leading-tight text-on-surface animate-fade-in-up delay-3">
              Talent <span className="gold-gradient-text italic">Acquisition.</span>
            </h1>
          </div>
          
          <div className="flex gap-4 animate-fade-in-right delay-3">
            <div className="glass-panel px-6 py-4 border-l border-primary border-t-0 border-r-0 border-b-0 hover-lift">
              <span className="block font-spaceGrotesk text-xs tracking-widest text-secondary mb-1">ACTIVE_SEARCHES</span>
              <span className="font-newsreader text-3xl text-primary">04</span>
            </div>
            <div className="glass-panel px-6 py-4 border-l border-outline border-t-0 border-r-0 border-b-0 hover-lift">
              <span className="block font-spaceGrotesk text-xs tracking-widest text-secondary mb-1">NEW_MATCHES</span>
              <span className="font-newsreader text-3xl text-on-surface">12</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar (The Ghost Border) */}
        <div className="w-full flex gap-4 animate-fade-in-up delay-4">
          <div className="flex-1 relative group">
            <input 
              type="text" 
              placeholder="Search by skill, role, or ID..." 
              className="w-full bg-surface-lowest text-on-surface font-spaceGrotesk tracking-widest outline-none py-4 border-b border-outline-variant/30 focus:border-primary transition-colors placeholder:text-outline"
            />
            <div className="absolute right-0 bottom-4 font-spaceGrotesk text-[10px] text-secondary">Press / to focus</div>
          </div>
          <button className="px-8 py-4 border border-outline-variant/30 bg-surface-container-low hover:bg-surface-container hover:shadow-golden-glow transition-all font-spaceGrotesk text-sm tracking-widest text-secondary hover:text-primary hover-glow-border">
            FILTERS
          </button>
        </div>

        {/* Content Tabs & Main Table */}
        <div className="flex flex-col xl:flex-row gap-12">
          
          {/* Main Candidate Feed */}
          <div className="flex-1 w-full">
            <div className="flex gap-8 mb-6 border-b border-outline-variant/20 font-spaceGrotesk text-xs tracking-widest animate-fade-in-up delay-5">
              <button className="pb-4 text-primary border-b-2 border-primary">RECOMMENDED</button>
              <button className="pb-4 text-secondary hover:text-on-surface transition-colors">SAVED_PROFILES</button>
              <button className="pb-4 text-secondary hover:text-on-surface transition-colors">PIPELINE</button>
            </div>

            <div className="flex flex-col gap-6">
              {candidates.map((c, i) => (
                <div key={i} className={`glass-panel p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all duration-500 cursor-pointer group hover-lift hover-glow-border animate-fade-in-up delay-${6 + i}`}>
                  
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-surface-container border border-outline-variant/30 relative animate-scale-in">
                       <div className="absolute inset-0 bg-gradient-gold opacity-10 mix-blend-overlay" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-newsreader text-on-surface group-hover:text-primary transition-colors">{c.name}</h3>
                      <p className="font-spaceGrotesk text-xs tracking-widest text-secondary uppercase mt-1">{c.role}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap md:flex-nowrap items-center gap-8 md:gap-12 w-full md:w-auto">
                    <div className="flex flex-col">
                      <span className="font-spaceGrotesk text-[10px] tracking-widest text-outline uppercase mb-1">MATCH</span>
                      <span className="font-spaceGrotesk text-lg text-primary">{c.match}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-spaceGrotesk text-[10px] tracking-widest text-outline uppercase mb-1">REPUTATION</span>
                      <span className="font-spaceGrotesk text-lg text-on-surface">{c.rep}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-spaceGrotesk text-[10px] tracking-widest text-outline uppercase mb-1">STATUS</span>
                      <span className={`px-2 py-1 font-spaceGrotesk text-[10px] tracking-widest uppercase border 
                        ${c.status === 'AVAILABLE' ? 'border-primary/50 text-primary animate-border-glow' : 
                          c.status === 'INTERVIEWING' ? 'border-outline text-on-surface animate-shimmer' : 
                          'border-success/30 text-success'}`}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                  
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center animate-fade-in-up delay-10">
              <button className="px-8 py-4 border border-outline-variant/30 text-secondary font-spaceGrotesk text-xs tracking-widest hover:text-primary hover:border-primary/50 transition-colors hover-glow-border">
                LOAD_MORE_CANDIDATES
              </button>
            </div>
          </div>

          {/* Right Sidebar: Quick Actions & Pipeline Status */}
          <div className="xl:w-80 w-full flex flex-col gap-8 animate-fade-in-right delay-6">
            <div className="glass-panel p-6 border-t-2 border-t-primary/50 hover-lift">
              <h3 className="font-spaceGrotesk text-xs tracking-widest text-primary mb-4 animate-shimmer">REQUIREMENT_PROFILES</h3>
              <div className="flex flex-col gap-4 font-manrope text-sm text-secondary">
                <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20">
                  <span>Senior Backend</span>
                  <span className="text-on-surface">3 Matches</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20">
                  <span>ML Ops Engineer</span>
                  <span className="text-on-surface">1 Match</span>
                </div>
                <button className="text-left font-spaceGrotesk text-xs tracking-widest text-primary hover:text-primary-on transition-colors mt-2">
                  + CREATE_NEW_PROFILE
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
