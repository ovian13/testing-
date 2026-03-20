import Link from "next/link";
import Image from "next/image";

export default function LeaderboardPage() {
  const users = [
    { rank: 1, name: "Arjun V.", track: "Systems Architect", rep: 2450, proofs: 21, streak: 45 },
    { rank: 2, name: "Sarah K.", track: "Machine Learning", rep: 2310, proofs: 19, streak: 30 },
    { rank: 3, name: "David O.", track: "Frontend Engineer", rep: 2100, proofs: 18, streak: 12 },
    { rank: 4, name: "Emily R.", track: "Cybersecurity", rep: 1950, proofs: 15, streak: 22 },
    { rank: 42, name: "Karthik N.", track: "Systems Architect", rep: 1840, proofs: 14, streak: 28, isCurrentUser: true }
  ];

  return (
    <main className="min-h-screen relative bg-surface-lowest pt-32 pb-24 px-6 md:px-12 md:pl-24">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-breathe" />

      {/* Top Navigation Back Link */}
      <nav className="absolute top-12 left-6 md:left-12 z-50 animate-fade-in-left">
        <Link href="/" className="flex items-center gap-2 text-secondary hover:text-primary transition-colors font-spaceGrotesk text-sm tracking-widest">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          RETURN TO HUB
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto flex flex-col gap-16 relative z-10">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-outline-variant/30 pb-8 animate-fade-in-up delay-1">
          <div>
            <div className="inline-block px-4 py-1.5 mb-6 border border-outline-variant/30 bg-surface-container/50 font-spaceGrotesk text-xs tracking-[0.2em] text-secondary uppercase animate-typewriter delay-2">
              SYS_MODULE: LEADERBOARD
            </div>
            <h1 className="text-5xl md:text-7xl font-newsreader tracking-[-0.02em] leading-tight text-on-surface animate-fade-in-up delay-3">
              The <span className="gold-gradient-text italic">Vanguard.</span>
            </h1>
          </div>
          <div className="text-right animate-fade-in-right delay-3">
            <p className="font-spaceGrotesk text-secondary text-sm tracking-widest uppercase mb-2 animate-shimmer px-2 py-1">SEASON_01_ACTIVE</p>
            <p className="font-manrope text-on-surface-variant text-sm border-r border-primary/40 pr-4 py-1 animate-border-glow">
              Engineers ranked by verified proofs<br />and active contributions.
            </p>
          </div>
        </div>

        {/* Global Leaderboard Table */}
        <div className="w-full relative animate-scale-in delay-4">
          
          <div className="w-full glass-panel overflow-hidden">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container">
                  <th className="font-spaceGrotesk text-[10px] tracking-widest text-secondary uppercase py-6 px-8 font-normal">Rank</th>
                  <th className="font-spaceGrotesk text-[10px] tracking-widest text-secondary uppercase py-6 px-8 font-normal">Engineer</th>
                  <th className="font-spaceGrotesk text-[10px] tracking-widest text-secondary uppercase py-6 px-8 font-normal">Track</th>
                  <th className="font-spaceGrotesk text-[10px] tracking-widest text-secondary uppercase py-6 px-8 font-normal text-right">Reputation</th>
                  <th className="font-spaceGrotesk text-[10px] tracking-widest text-secondary uppercase py-6 px-8 font-normal text-right">Proofs Verified</th>
                  <th className="font-spaceGrotesk text-[10px] tracking-widest text-secondary uppercase py-6 px-8 font-normal text-right">Streak</th>
                </tr>
              </thead>
              <tbody className="font-manrope text-sm text-on-surface-variant">
                {users.map((user, i) => (
                  <tr key={i} className={`border-b border-outline-variant/10 transition-all duration-300 animate-fade-in-up delay-${5 + i}
                    ${user.isCurrentUser ? 'bg-primary/5 hover:bg-primary/10 animate-glow-pulse' : 'hover:bg-surface-container'}`}>
                    
                    <td className="py-6 px-8">
                      <div className={`font-spaceGrotesk text-sm tracking-widest 
                        ${user.rank === 1 ? 'text-primary font-bold' : user.rank <= 3 ? 'text-on-surface' : 'text-secondary'}`}>
                        {user.rank < 10 ? `0${user.rank}` : user.rank}
                      </div>
                    </td>
                    
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-none border overflow-hidden relative 
                          ${user.rank <= 3 ? 'border-primary' : 'border-outline-variant/30'}`}>
                          <div className="absolute inset-0 bg-surface-lowest" />
                          <Image 
                            src={`https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&q=80&w=100&h=100`} 
                            alt={user.name}
                            layout="fill"
                            objectFit="cover"
                            className="grayscale mix-blend-luminosity"
                          />
                        </div>
                        <span className={`font-newsreader text-lg ${user.isCurrentUser ? 'text-primary' : 'text-on-surface'}`}>
                          {user.name} {user.isCurrentUser && <span className="ml-2 font-spaceGrotesk text-[10px] tracking-widest text-primary border border-primary px-1 hover:bg-primary hover:text-primary-on transition-colors animate-border-glow">YOU</span>}
                        </span>
                      </div>
                    </td>
                    
                    <td className="py-6 px-8 font-spaceGrotesk text-xs tracking-widest text-primary/80 uppercase">
                      {user.track}
                    </td>
                    
                    <td className="py-6 px-8 text-right font-spaceGrotesk font-semibold text-on-surface">
                      {user.rep.toLocaleString()}
                    </td>
                    
                    <td className="py-6 px-8 text-right font-spaceGrotesk text-secondary">
                      {user.proofs}
                    </td>
                    
                    <td className="py-6 px-8 text-right font-spaceGrotesk">
                      <span className="text-primary">{user.streak}</span>
                      <span className="text-secondary/50 text-[10px] ml-1">DAYS</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
    </main>
  );
}
