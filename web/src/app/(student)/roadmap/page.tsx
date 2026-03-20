import Link from "next/link";

export default function RoadmapPage() {
  const milestones = [
    {
      id: "01",
      title: "Foundations of Computer Science",
      status: "COMPLETED",
      description: "Mastery of data structures, algorithms, and core system architectures.",
      skills: ["C++", "Python", "Algorithms"]
    },
    {
      id: "02",
      title: "Backend Architecture",
      status: "IN PROGRESS",
      description: "Designing scalable distributed systems and robust APIs.",
      skills: ["Node.js", "PostgreSQL", "Docker", "Redis"]
    },
    {
      id: "03",
      title: "Advanced System Design",
      status: "LOCKED",
      description: "Understanding high availability, load balancing, and fault tolerance strategies.",
      skills: ["System Design", "Kubernetes", "AWS"]
    }
  ];

  return (
    <main className="min-h-screen relative bg-background pt-32 pb-24 px-6 md:px-12 md:pl-32">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] mix-blend-screen pointer-events-none animate-breathe" />

      {/* Top Navigation Back Link */}
      <nav className="absolute top-12 left-6 md:left-12 z-50 animate-fade-in-left">
        <Link href="/" className="flex items-center gap-2 text-secondary hover:text-primary transition-colors font-spaceGrotesk text-sm tracking-widest">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          RETURN TO HUB
        </Link>
      </nav>
      
      <div className="max-w-6xl relative z-10 flex flex-col md:flex-row gap-16">
        {/* Left Content Area: Intentional Asymmetry */}
        <div className="md:w-1/3 flex flex-col animate-fade-in-left delay-2">
          <div className="inline-block px-4 py-1.5 mb-6 border border-outline-variant/30 bg-surface-container/50 font-spaceGrotesk text-xs tracking-[0.2em] text-secondary uppercase self-start animate-typewriter delay-3">
            SYS_MODULE: ROADMAP
          </div>
          
          <h1 className="text-5xl md:text-7xl font-newsreader tracking-[-0.02em] leading-tight text-on-surface mb-6 animate-fade-in-up delay-3">
            The <span className="gold-gradient-text italic">Ascension</span> Path
          </h1>
          
          <p className="text-lg font-manrope text-on-surfaceVariant leading-relaxed mb-12 animate-fade-in-up delay-4">
            Your structured progression through the engineering ranks. Each node represents a pivotal mastery requirement before advancing to the next tier of complexity.
          </p>

          <div className="glass-panel p-6 border-l-2 border-l-primary/50 animate-fade-in-up delay-5 animate-border-glow">
            <h3 className="font-spaceGrotesk text-xs tracking-widest text-primary mb-2">CURRENT PROTOCOL</h3>
            <p className="font-manrope text-sm text-secondary leading-loose">
              Focus is currently required on <strong className="text-on-surface font-semibold">Backend Architecture</strong>. Complete 3 more verification modules to unlock the next heavily secured sector.
            </p>
          </div>
        </div>

        {/* Right Content Area: The Roadmap Nodes  */}
        <div className="md:w-2/3 flex flex-col gap-8 relative">
          {/* Vertical tracking line connecting nodes */}
          <div className="absolute left-[39px] top-12 bottom-12 w-px bg-outline-variant/30 hidden sm:block" />

          {milestones.map((node, index) => (
            <div key={node.id} className={`relative flex gap-6 sm:gap-12 group animate-fade-in-up delay-${3 + index * 2}`}>
              {/* Status Indicator */}
              <div className="hidden sm:flex flex-col items-center pt-2 relative z-10">
                <div className={`w-20 h-20 rounded-none border flex items-center justify-center font-spaceGrotesk text-sm tracking-widest transition-all duration-500
                  ${node.status === 'COMPLETED' ? 'bg-primary/10 border-primary text-primary shadow-golden-glow animate-glow-pulse' : 
                    node.status === 'IN PROGRESS' ? 'bg-surface-bright border-primary/50 text-secondary animate-border-glow' : 
                    'bg-surface-container border-outline-variant/30 text-outline'}`}>
                  {node.id}
                </div>
              </div>

              {/* Content Card */}
              <div className={`flex-1 p-8 bg-surface-container-low transition-all duration-500 hover:bg-surface-container hover-lift hover-glow-border
                ${node.status === 'LOCKED' ? 'opacity-50 grayscale hover:opacity-80 hover:grayscale-0' : ''}`}>
                
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-3xl font-newsreader text-on-surface tracking-tight">{node.title}</h2>
                  <span className={`px-3 py-1 font-spaceGrotesk text-xs tracking-widest border 
                    ${node.status === 'COMPLETED' ? 'border-success/30 text-success' : 
                      node.status === 'IN PROGRESS' ? 'border-primary/50 text-primary animate-shimmer' : 
                      'border-outline-variant/50 text-outline'}`}>
                    [{node.status}]
                  </span>
                </div>
                
                <p className="font-manrope text-secondary leading-relaxed mb-6">
                  {node.description}
                </p>

                {/* Engineering Chips */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {node.skills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-surface-variant font-spaceGrotesk text-xs tracking-widest text-on-surface-variant border-b border-b-outline-variant/20 hover:border-b-primary/50 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
