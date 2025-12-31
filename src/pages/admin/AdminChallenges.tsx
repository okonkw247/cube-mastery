import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminData } from '@/hooks/useAdminData';
import { useAdminResources } from '@/hooks/useAdminResources';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Trophy, Clock, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminChallenges() {
  const { challenges, fetchChallenges } = useAdminData();
  const { createChallenge, deleteChallenge, updateChallenge, saving } = useAdminResources();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', duration_seconds: 60, difficulty: 'easy' as const, points: 10, lesson_id: null as string | null, is_active: true });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createChallenge(formData);
    setDialogOpen(false);
    fetchChallenges();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this challenge?')) {
      await deleteChallenge(id);
      fetchChallenges();
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await updateChallenge(id, { is_active: !isActive });
    fetchChallenges();
  };

  const getDifficultyColor = (d: string) => {
    switch (d) {
      case 'easy': return 'bg-green-500/10 text-green-500';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500';
      case 'hard': return 'bg-orange-500/10 text-orange-500';
      case 'expert': return 'bg-red-500/10 text-red-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <AdminLayout requiredPermission="manage_challenges">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Challenges</h1>
            <p className="text-muted-foreground">Timer-based practice challenges</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />New Challenge</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New Challenge</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label>Title</Label><Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required /></div>
                <div><Label>Description</Label><Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Duration (seconds)</Label><Input type="number" value={formData.duration_seconds} onChange={e => setFormData({ ...formData, duration_seconds: +e.target.value })} /></div>
                  <div><Label>Points</Label><Input type="number" value={formData.points} onChange={e => setFormData({ ...formData, points: +e.target.value })} /></div>
                </div>
                <div><Label>Difficulty</Label>
                  <Select value={formData.difficulty} onValueChange={v => setFormData({ ...formData, difficulty: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={saving} className="w-full">{saving ? 'Saving...' : 'Create'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map(c => (
            <div key={c.id} className={`bg-card rounded-xl p-4 border transition-colors ${c.is_active ? 'border-border hover:border-primary/30' : 'border-border/50 opacity-60'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold">{c.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                </div>
                <Switch checked={c.is_active} onCheckedChange={() => toggleActive(c.id, c.is_active)} />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={getDifficultyColor(c.difficulty)}>{c.difficulty}</Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{c.duration_seconds}s</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Trophy className="w-3 h-3" />{c.points}pts</span>
              </div>
              <div className="mt-3 pt-3 border-t border-border flex justify-end">
                <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
