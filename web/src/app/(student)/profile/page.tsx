import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  return (
    <main className="min-h-screen relative bg-surface-lowest pt-32 pb-24 px-6 md:px-12 md:pl-24">
      {/* Background ambient glow matching the accent color */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] mix-blend-screen pointer-events-none animate-breathe" />

      {/* Top Navigation Back Link */}
      <nav className="absolute top-12 left-6 md:left-12 z-50 animate-fade-in-left">
        <Link href="/" className="flex items-center gap-2 text-secondary hover:text-primary transition-colors font-spaceGrotesk text-sm tracking-widest">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          RETURN TO HUB
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 relative z-10">
        
        {/* Left Column: Profile Core */}
        <div className="lg:w-1/3 flex flex-col gap-8 animate-fade-in-left delay-2">
          {/* Avatar / Identity Block */}
          <div className="relative group">
            <div className="w-48 h-48 border border-outline-variant/30 bg-surface-container overflow-hidden mb-6 relative hover:shadow-golden-glow transition-all duration-700 animate-scale-in delay-3">
              <div className="absolute inset-0 bg-gradient-gold opacity-10 mix-blend-overlay" />
              <Image 
                src="https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=200&h=200" 
                alt="Profile Avatar"
                layout="fill"
                objectFit="cover"
                className="grayscale group-hover:grayscale-0 transition-all duration-700 mix-blend-luminosity hover:mix-blend-normal"
              />
            </div>
            
            <div className="inline-block px-4 py-1 border border-outline-variant/30 bg-surface-container/50 font-spaceGrotesk text-[10px] tracking-[0.2em] text-primary uppercase mb-4 animate-fade-in-up delay-4">
              CLASS_OF_2028 // ELITE_TIER
            </div>
            
            <h1 className="text-5xl font-newsreader tracking-tight leading-none text-on-surface mb-2 mt-2 animate-fade-in-up delay-4">
              Karthik <span className="gold-gradient-text italic">N.</span>
            </h1>
            <p className="font-spaceGrotesk text-secondary text-sm tracking-widest uppercase mt-4 mb-2 animate-fade-in-up delay-5">Systems Architect Track</p>
            <p className="font-manrope text-on-surface-variant text-sm border-l border-primary/40 pl-4 py-1 animate-fade-in-up delay-5 animate-border-glow">
              Currently engineering robust microservices. Obsessed with distributed caching mechanisms and low-latency systems.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-px bg-outline-variant/20 border border-outline-variant/20 mt-8 animate-fade-in-up delay-6">
            <div className="bg-surface-lowest p-6 flex flex-col hover-lift">
              <span className="font-spaceGrotesk text-xs tracking-widest text-secondary mb-1">GLOBAL_RANK</span>
              <span className="font-newsreader text-3xl text-primary">#42</span>
            </div>
            <div className="bg-surface-lowest p-6 flex flex-col hover-lift">
              <span className="font-spaceGrotesk text-xs tracking-widest text-secondary mb-1">REPUTATION</span>
              <span className="font-newsreader text-3xl text-on-surface">1,840</span>
            </div>
            <div className="bg-surface-lowest p-6 flex flex-col hover-lift">
              <span className="font-spaceGrotesk text-xs tracking-widest text-secondary mb-1">PROOFS_VERIFIED</span>
              <span className="font-newsreader text-3xl text-on-surface">14</span>
            </div>
            <div className="bg-surface-lowest p-6 flex flex-col hover-lift">
              <span className="font-spaceGrotesk text-xs tracking-widest text-secondary mb-1">STREAK_DAYS</span>
              <span className="font-newsreader text-3xl text-primary">28</span>
            </div>
          </div>
          
          <button className="w-full py-4 mt-4 font-spaceGrotesk text-sm font-bold tracking-widest text-primary hover:text-primary-on hover:bg-primary border border-primary/50 transition-all animate-fade-in-up delay-7 hover-glow-border">
            EXTRACT DATA DOSSIER
          </button>
        </div>

        {/* Right Column: Engineering Portfolio / Activity */}
        <div className="lg:w-2/3 flex flex-col gap-12">
          
          <section className="animate-fade-in-right delay-3">
            <div className="flex justify-between items-end border-b border-outline-variant/30 pb-4 mb-8">
              <h2 className="text-2xl font-newsreader text-on-surface tracking-tight">Verified Proofs of Work</h2>
              <span className="font-spaceGrotesk text-xs tracking-widest text-primary uppercase animate-shimmer px-2 py-1">03_ENTRIES</span>
            </div>

            <div className="flex flex-col gap-6">
              {[
                { title: 'Distributed Cache Implementation', role: 'Lead Backend Engineer', tech: ['Go', 'Redis', 'Docker'], desc: 'Architected an in-memory datastore acting as a proxy cache for PostgreSQL reads, reducing query latency by 45%.' },
                { title: 'Asynchronous Pipeline Worker', role: 'Systems Developer', tech: ['Python', 'Celery', 'RabbitMQ'], desc: 'Built a fault-tolerant job queue system for processing heavy background ML prediction tasks.' },
                { title: 'Neo-Noir UI Kit', role: 'Frontend Architect', tech: ['React', 'Tailwind', 'Framer Motion'], desc: 'Designed and implemented the core visual language system mapping to specific dark-mode aesthetic constraints.' }
              ].map((proj, i) => (
                <div key={i} className={`group relative bg-surface-container-low border border-outline-variant/10 p-8 hover:bg-surface-container transition-all duration-500 hover-lift hover-glow-border animate-fade-in-up delay-${4 + i}`}>
                  <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center font-spaceGrotesk text-[10px] text-secondary border-b border-l border-outline-variant/20">
                    0{i+1}
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-xl font-newsreader text-on-surface mb-1 group-hover:text-primary transition-colors">{proj.title}</h3>
                    <div className="font-spaceGrotesk text-xs tracking-widest text-secondary uppercase">{proj.role}</div>
                  </div>
                  
                  <p className="font-manrope text-sm text-on-surface-variant leading-relaxed mb-6">
                    {proj.desc}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {proj.tech.map(t => (
                      <span key={t} className="px-2 py-1 bg-surface-lowest font-spaceGrotesk text-[10px] tracking-widest text-primary border border-outline-variant/20 hover-glow-border">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 animate-fade-in-right delay-6">
            <div className="flex justify-between items-end border-b border-outline-variant/30 pb-4 mb-8">
              <h2 className="text-2xl font-newsreader text-on-surface tracking-tight">Skill Matrix Assessment</h2>
              <Link href="/roadmap" className="font-spaceGrotesk text-xs tracking-widest text-secondary hover:text-primary transition-colors uppercase flex items-center gap-2">
                VIEW_ROADMAP <span className="text-primary">&rarr;</span>
              </Link>
            </div>
            
            <div className="glass-panel p-8 grid gap-6 animate-scale-in delay-7">
              {[
                { skill: 'Backend Architecture', percent: 85 },
                { skill: 'Data Structures & Algorithms', percent: 70 },
                { skill: 'System Design', percent: 40 },
                { skill: 'Frontend Implementation', percent: 90 },
              ].map(s => (
                <div key={s.skill} className="flex flex-col gap-2">
                  <div className="flex justify-between font-spaceGrotesk text-xs tracking-widest">
                    <span className="text-on-surface">{s.skill}</span>
                    <span className="text-primary">{s.percent}%</span>
                  </div>
                  <div className="h-1 w-full bg-surface-container-highest relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-gradient-gold animate-expand-width delay-8" style={{ width: `${s.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
