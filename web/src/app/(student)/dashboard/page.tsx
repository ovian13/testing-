export default function StudentDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
          <h2 className="text-xl font-semibold mb-2">Daily Streak</h2>
          <p className="text-4xl font-bold text-accent">0 Days</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
          <h2 className="text-xl font-semibold mb-2">XP Points</h2>
          <p className="text-4xl font-bold text-success">0 XP</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
          <h2 className="text-xl font-semibold mb-2">Current Level</h2>
          <p className="text-4xl font-bold text-primary">Level 1</p>
        </div>
      </div>
    </div>
  );
}
