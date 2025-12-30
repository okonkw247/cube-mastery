import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  email: string;
}

export function EmailVerificationBanner({ email }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);

  const handleResend = async () => {
    setSending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    setSending(false);
    if (error) {
      toast.error("Failed to resend verification email");
    } else {
      toast.success("Verification email sent!");
    }
  };

  if (dismissed) return null;

  return (
    <div className="bg-destructive/10 border border-destructive/30 text-destructive-foreground px-4 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
        <p className="text-sm">
          Please verify your email address.{" "}
          <Button
            variant="link"
            className="p-0 h-auto text-sm text-primary underline"
            onClick={handleResend}
            disabled={sending}
          >
            {sending ? "Sending..." : "Resend verification email"}
          </Button>
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-muted-foreground hover:text-foreground"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
