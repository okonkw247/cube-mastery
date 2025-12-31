import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatCard } from '@/components/admin/StatCard';
import { useAdminData } from '@/hooks/useAdminData';
import { Users, BookOpen, Timer, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { stats, topPerformers, loading } = useAdminData();

  const chartData = [
    { name: 'Mon', students: 12 }, { name: 'Tue', students: 19 },
    { name: 'Wed', students: 15 }, { name: 'Thu', students: 22 },
    { name: 'Fri', students: 30 }, { name: 'Sat', students: 25 },
    { name: 'Sun', students: 18 },
  ];

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
                <AreaChart data={chartData}>
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
    </AdminLayout>
  );
}
