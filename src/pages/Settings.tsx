import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import {
  User,
  Palette,
  Globe,
  Bell,
  Shield,
  CreditCard,
  Puzzle,
  ChevronRight,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react";
import jsnLogo from "@/assets/jsn-logo.png";

const settingsTabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "theme", label: "Theme", icon: Palette },
  { id: "language", label: "Time and language", icon: Globe },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "plugins", label: "Plugins", icon: Puzzle },
];

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [activeTab, setActiveTab] = useState("profile");
  const [twoStepEnabled, setTwoStepEnabled] = useState(false);
  const [supportAccess, setSupportAccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const displayName = profile?.full_name || user.email?.split("@")[0] || "User";
  const email = user.email || "";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={jsnLogo} alt="JSN Logo" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold text-foreground">JSN Cubing</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="w-8 h-8 text-foreground" />
          <h1 className="text-4xl font-bold italic">Settings</h1>
        </div>

        <div className="grid lg:grid-cols-[280px,1fr] gap-6">
          {/* Sidebar */}
          <div className="card-gradient rounded-2xl border border-border p-4 h-fit">
            <nav className="space-y-1">
              {settingsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="card-gradient rounded-2xl border border-border p-6 lg:p-8">
            {activeTab === "profile" && (
              <div className="space-y-8">
                {/* Profile Header */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{displayName}</h2>
                    <p className="text-muted-foreground">{email}</p>
                  </div>
                </div>

                {/* Name */}
                <div className="flex items-center justify-between py-4 border-b border-border">
                  <span className="text-muted-foreground">Name</span>
                  <button className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                    <span>{displayName}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Account Security Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Account security</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Email</span>
                      <button className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                        <span>{email}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-border bg-secondary/30 px-4 rounded-lg -mx-4">
                      <div>
                        <span className="font-medium">Password</span>
                        <p className="text-sm text-muted-foreground">
                          Set a permanent password to login to your account.
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <span className="font-medium">2-step verification</span>
                        <p className="text-sm text-muted-foreground">
                          Add an additional layer of security to your account during login.
                        </p>
                      </div>
                      <Switch
                        checked={twoStepEnabled}
                        onCheckedChange={setTwoStepEnabled}
                      />
                    </div>
                  </div>
                </div>

                {/* Support Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Support</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <span className="font-medium">Support access</span>
                        <p className="text-sm text-muted-foreground">
                          Grant JSN support temporary access to your account so we can troubleshoot problems or recover content on your behalf. You can revoke access at any time.
                        </p>
                      </div>
                      <Switch
                        checked={supportAccess}
                        onCheckedChange={setSupportAccess}
                      />
                    </div>

                    <button className="flex items-center justify-between w-full py-3 hover:text-primary transition-colors">
                      <div>
                        <span className="font-medium">Log out of all devices</span>
                        <p className="text-sm text-muted-foreground">
                          Log out of all other active sessions on other devices besides this one.
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button className="flex items-center justify-between w-full py-3 text-destructive hover:text-destructive/80 transition-colors">
                      <div className="text-left">
                        <span className="font-medium">Delete my account</span>
                        <p className="text-sm opacity-70">
                          Permanently delete the account and remove access from all devices.
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== "profile" && (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <p>{settingsTabs.find((t) => t.id === activeTab)?.label} settings coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;