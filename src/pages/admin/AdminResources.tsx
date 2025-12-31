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
import { Plus, FileText, Video, Link2, Trash2, Download, Eye } from 'lucide-react';

export default function AdminResources() {
  const { resources, fetchResources } = useAdminData();
  const { createResource, deleteResource, saving } = useAdminResources();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', type: 'pdf' as const, url: '', category: '', difficulty: 'beginner', lesson_id: null as string | null });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createResource(formData);
    setDialogOpen(false);
    fetchResources();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this resource?')) {
      await deleteResource(id);
      fetchResources();
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
      case 'video': return <Video className="w-5 h-5 text-blue-500" />;
      default: return <Link2 className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <AdminLayout requiredPermission="manage_resources">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Resources</h1>
            <p className="text-muted-foreground">Manage PDFs, videos, and links</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Add Resource</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New Resource</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label>Title</Label><Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required /></div>
                <div><Label>Type</Label>
                  <Select value={formData.type} onValueChange={v => setFormData({ ...formData, type: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="link">Link</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>URL</Label><Input value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} required /></div>
                <div><Label>Description</Label><Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} /></div>
                <Button type="submit" disabled={saving} className="w-full">{saving ? 'Saving...' : 'Create'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map(r => (
            <div key={r.id} className="bg-card rounded-xl p-4 border border-border hover:border-primary/30 transition-colors">
              <div className="flex items-start gap-3">
                {getIcon(r.type)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{r.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{r.description}</p>
                  <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                    <span><Eye className="w-3 h-3 inline mr-1" />{r.view_count}</span>
                    <span><Download className="w-3 h-3 inline mr-1" />{r.download_count}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
