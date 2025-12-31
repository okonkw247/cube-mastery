import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useLessons } from '@/hooks/useLessons';
import { useAdminLessons } from '@/hooks/useAdminLessons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit, Eye, GripVertical } from 'lucide-react';
import { InlineEdit } from '@/components/admin/InlineEdit';
import { VideoPreviewModal } from '@/components/admin/VideoPreviewModal';
import { toast } from 'sonner';

export default function AdminLessons() {
  const { lessons, refetch } = useLessons();
  const { createLesson, updateLesson, deleteLesson, saving } = useAdminLessons();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewLesson, setPreviewLesson] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '', description: '', video_url: '', duration: '', skill_level: 'beginner',
    is_free: false, order_index: lessons.length, status: 'published' as const,
    tags: [] as string[], prerequisites: [] as string[], preview_duration: 30,
    video_quality: 'high' as const, thumbnail_url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createLesson(formData);
    if (result) {
      setDialogOpen(false);
      refetch();
      setFormData({ ...formData, title: '', description: '', video_url: '' });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this lesson?')) {
      await deleteLesson(id);
      refetch();
    }
  };

  return (
    <AdminLayout requiredPermission="manage_lessons">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Lessons Management</h1>
            <p className="text-muted-foreground">Create and manage course lessons</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />Add Lesson</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>New Lesson</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label>Title</Label><Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required /></div>
                <div><Label>Description</Label><Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} /></div>
                <div><Label>Video URL</Label><Input value={formData.video_url} onChange={e => setFormData({ ...formData, video_url: e.target.value })} placeholder="YouTube, TikTok, or direct URL" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Duration</Label><Input value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g., 10:30" /></div>
                  <div><Label>Skill Level</Label>
                    <Select value={formData.skill_level} onValueChange={v => setFormData({ ...formData, skill_level: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-2"><Switch checked={formData.is_free} onCheckedChange={v => setFormData({ ...formData, is_free: v })} /><Label>Free Lesson</Label></div>
                <Button type="submit" disabled={saving} className="w-full">{saving ? 'Saving...' : 'Create Lesson'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          {lessons.map((lesson, i) => (
            <div key={lesson.id} className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border hover:border-primary/30 transition-colors">
              <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
              <div className="flex-1 min-w-0">
                <InlineEdit value={lesson.title} onSave={v => updateLesson(lesson.id, { title: v }).then(refetch)} className="font-medium" />
                <p className="text-sm text-muted-foreground truncate">{lesson.description}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${lesson.is_free ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'}`}>
                {lesson.is_free ? 'Free' : 'Pro'}
              </span>
              <div className="flex gap-1">
                {lesson.video_url && <Button variant="ghost" size="icon" onClick={() => setPreviewLesson(lesson)}><Eye className="w-4 h-4" /></Button>}
                <Button variant="ghost" size="icon" onClick={() => handleDelete(lesson.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {previewLesson && (
        <VideoPreviewModal open={!!previewLesson} onClose={() => setPreviewLesson(null)} videoUrl={previewLesson.video_url || ''} title={previewLesson.title} />
      )}
    </AdminLayout>
  );
}
