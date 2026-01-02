import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Copy, Check, Mail, Link2 } from "lucide-react";

interface AdminInviteModalProps {
  open: boolean;
  onClose: () => void;
}

export function AdminInviteModal({ open, onClose }: AdminInviteModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreateInvite = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("admin_invites")
        .insert({
          email: email || null,
          role: "content_admin",
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      const link = `${window.location.origin}/admin/invite/${data.token}`;
      setInviteLink(link);
      toast.success("Invite link created!");
    } catch (error: any) {
      toast.error(error.message || "Failed to create invite");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setEmail("");
    setInviteLink(null);
    setCopied(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-primary" />
            Invite Content Admin
          </DialogTitle>
          <DialogDescription>
            Create an invite link for your client to access the admin dashboard.
            They will be able to manage lessons but not financial settings.
          </DialogDescription>
        </DialogHeader>

        {!inviteLink ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="client@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                If provided, only this email can use the invite link.
              </p>
            </div>

            <Button onClick={handleCreateInvite} disabled={loading} className="w-full">
              {loading ? "Creating..." : "Generate Invite Link"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-sm font-medium">Invite Link</span>
                <span className="text-xs text-muted-foreground">Expires in 7 days</span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="text-xs font-mono"
                />
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
              <p className="text-sm font-medium text-primary mb-1">
                📧 Message to send your client:
              </p>
              <p className="text-xs text-muted-foreground">
                "You have been added to be a part of the site as a Content Admin. 
                Use this link to access the admin dashboard. 
                Do not share this link with anyone."
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Close
              </Button>
              <Button onClick={() => setInviteLink(null)} className="flex-1">
                Create Another
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
