import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatCard } from '@/components/admin/StatCard';
import { useAdminData } from '@/hooks/useAdminData';
import { CelebrationPopup, useCelebration } from '@/components/admin/CelebrationPopup';
import { Users, BookOpen, Timer, TrendingUp, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { stats, topPerformers, weeklyActivity, loading } = useAdminData();
  const { celebration, celebrate, closeCelebration } = useCelebration();
  const [celebratedMilestones, setCelebratedMilestones] = useState<Set<string>>(new Set());

  // Check for milestone achievements and trigger celebrations
  useEffect(() => {
    if (loading || topPerformers.length === 0) return;

    // Celebrate top performer reaching new point milestones
    const topPerformer = topPerformers[0];
    if (topPerformer) {
      const milestones = [100, 250, 500, 1000, 2500, 5000];
      for (const milestone of milestones) {
        const key = `${topPerformer.id}-points-${milestone}`;
        if (topPerformer.points >= milestone && !celebratedMilestones.has(key)) {
          celebrate('points', `${milestone} Points Achieved!`, topPerformer.name);
          setCelebratedMilestones(prev => new Set([...prev, key]));
          break;
        }
      }
    }

    // Celebrate student count milestones
    const studentMilestones = [10, 50, 100, 500, 1000];
    for (const milestone of studentMilestones) {
      const key = `students-${milestone}`;
      if (stats.totalStudents >= milestone && !celebratedMilestones.has(key)) {
        celebrate('lesson', `${milestone} Students Enrolled!`);
        setCelebratedMilestones(prev => new Set([...prev, key]));
        break;
      }
    }
  }, [loading, topPerformers, stats.totalStudents, celebratedMilestones, celebrate]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard title="Total Students" value={stats.totalStudents} icon={<Users className="w-5 h-5 text-primary" />} />
          <StatCard title="Active Today" value={stats.activeToday} icon={<TrendingUp className="w-5 h-5 text-primary" />} />
          <StatCard title="Lessons" value={stats.lessonsUploaded} icon={<BookOpen className="w-5 h-5 text-primary" />} />
          <StatCard title="Completed" value={stats.lessonsCompleted} icon={<BookOpen className="w-5 h-5 text-primary" />} />
          <StatCard title="Avg Practice" value={`${Math.round(stats.avgPracticeTime / 60)}m`} icon={<Timer className="w-5 h-5 text-primary" />} />
          <StatCard title="Pending" value={stats.pendingApprovals} icon={<AlertCircle className="w-5 h-5 text-primary" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-card rounded-xl p-6 border border-border">
            <h2 className="font-semibold mb-4">Weekly Activity</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyActivity.length > 0 ? weeklyActivity : [
                  { name: 'Mon', students: 0 }, { name: 'Tue', students: 0 },
                  { name: 'Wed', students: 0 }, { name: 'Thu', students: 0 },
                  { name: 'Fri', students: 0 }, { name: 'Sat', students: 0 },
                  { name: 'Sun', students: 0 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="students" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="font-semibold mb-4">Top Performers</h2>
            <div className="space-y-4">
              {topPerformers.length === 0 ? (
                <p className="text-muted-foreground text-sm">No data yet</p>
              ) : (
                topPerformers.map((user, i) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <span className="text-sm font-bold text-muted-foreground w-4">{i + 1}</span>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar || ''} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.points} pts</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <CelebrationPopup
        open={celebration.open}
        onClose={closeCelebration}
        type={celebration.type}
        milestone={celebration.milestone}
        userName={celebration.userName}
      />
    </AdminLayout>
  );
}