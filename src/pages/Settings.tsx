import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
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
  Moon,
  Sun,
  Check,
} from "lucide-react";
import jsnLogo from "@/assets/jsn-logo.png";
import EditProfileModal from "@/components/modals/EditProfileModal";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";
import DeleteAccountModal from "@/components/modals/DeleteAccountModal";

const settingsTabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "theme", label: "Theme", icon: Palette },
  { id: "language", label: "Time and language", icon: Globe },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "plugins", label: "Plugins", icon: Puzzle },
];

const themes = [
  { id: "dark", label: "Dark", icon: Moon },
  { id: "light", label: "Light", icon: Sun },
];

const languages = [
  { id: "en", label: "English (US)", flag: "🇺🇸" },
  { id: "es", label: "Español", flag: "🇪🇸" },
  { id: "fr", label: "Français", flag: "🇫🇷" },
  { id: "de", label: "Deutsch", flag: "🇩🇪" },
];

const timezones = [
  { id: "utc", label: "UTC (Coordinated Universal Time)" },
  { id: "est", label: "EST (Eastern Standard Time)" },
  { id: "pst", label: "PST (Pacific Standard Time)" },
  { id: "gmt", label: "GMT (Greenwich Mean Time)" },
];

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, refetch: refetchProfile } = useProfile();
  const [activeTab, setActiveTab] = useState("profile");
  const [twoStepEnabled, setTwoStepEnabled] = useState(false);
  const [supportAccess, setSupportAccess] = useState(false);
  
  // Modal states
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  // Theme state
  const [selectedTheme, setSelectedTheme] = useState("dark");
  
  // Language state
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedTimezone, setSelectedTimezone] = useState("utc");

  // Notification states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [progressReminders, setProgressReminders] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Privacy states
  const [profileVisibility, setProfileVisibility] = useState("private");
  const [activityTracking, setActivityTracking] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleLogOutAllDevices = async () => {
    toast.success("Logged out of all other devices");
  };

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    toast.success(`Theme changed to ${themeId}`);
    // In a real app, this would update the theme context/localStorage
  };

  const handleLanguageChange = (langId: string) => {
    setSelectedLanguage(langId);
    toast.success("Language preference saved");
  };

  const handleTimezoneChange = (tzId: string) => {
    setSelectedTimezone(tzId);
    toast.success("Timezone updated");
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
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-8">
                {/* Profile Header with Avatar */}
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt={displayName} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold">{displayName}</h2>
                    <p className="text-muted-foreground">{email}</p>
                  </div>
                  <Link to="/profile">
                    <Button variant="outline" size="sm">
                      Edit Profile
                    </Button>
                  </Link>
                </div>

                {/* Name - Links to Profile page */}
                <div className="flex items-center justify-between py-4 border-b border-border">
                  <span className="text-muted-foreground">Name</span>
                  <Link 
                    to="/profile"
                    className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                  >
                    <span>{displayName}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Avatar - Links to Profile page */}
                <div className="flex items-center justify-between py-4 border-b border-border">
                  <span className="text-muted-foreground">Profile Picture</span>
                  <Link 
                    to="/profile"
                    className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                  >
                    <span>{profile?.avatar_url ? "Change" : "Add"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Account Security Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Account security</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Email</span>
                      <span className="text-foreground">{email}</span>
                    </div>

                    <button 
                      onClick={() => setChangePasswordOpen(true)}
                      className="flex items-center justify-between w-full py-3 border-b border-border bg-secondary/30 px-4 rounded-lg -mx-4 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="text-left">
                        <span className="font-medium">Password</span>
                        <p className="text-sm text-muted-foreground">
                          Set a permanent password to login to your account.
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <span className="font-medium">2-step verification</span>
                        <p className="text-sm text-muted-foreground">
                          Add an additional layer of security to your account during login.
                        </p>
                      </div>
                      <Switch
                        checked={twoStepEnabled}
                        onCheckedChange={(checked) => {
                          setTwoStepEnabled(checked);
                          toast.success(checked ? "2-step verification enabled" : "2-step verification disabled");
                        }}
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
                        onCheckedChange={(checked) => {
                          setSupportAccess(checked);
                          toast.success(checked ? "Support access granted" : "Support access revoked");
                        }}
                      />
                    </div>

                    <button 
                      onClick={handleLogOutAllDevices}
                      className="flex items-center justify-between w-full py-3 hover:text-primary transition-colors"
                    >
                      <div className="text-left">
                        <span className="font-medium">Log out of all devices</span>
                        <p className="text-sm text-muted-foreground">
                          Log out of all other active sessions on other devices besides this one.
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button 
                      onClick={() => setDeleteAccountOpen(true)}
                      className="flex items-center justify-between w-full py-3 text-destructive hover:text-destructive/80 transition-colors"
                    >
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

            {/* Theme Tab */}
            {activeTab === "theme" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Appearance</h3>
                  <p className="text-muted-foreground mb-6">Choose how JSN Cubing looks to you.</p>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => handleThemeChange(theme.id)}
                        className={`p-6 rounded-xl border transition-all flex items-center gap-4 ${
                          selectedTheme === theme.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          theme.id === "dark" ? "bg-secondary" : "bg-yellow-100"
                        }`}>
                          <theme.icon className={`w-6 h-6 ${theme.id === "dark" ? "text-foreground" : "text-yellow-600"}`} />
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-medium">{theme.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {theme.id === "dark" ? "Easy on the eyes" : "Classic bright mode"}
                          </p>
                        </div>
                        {selectedTheme === theme.id && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Language Tab */}
            {activeTab === "language" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Language</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {languages.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => handleLanguageChange(lang.id)}
                        className={`p-4 rounded-xl border transition-all flex items-center gap-3 ${
                          selectedLanguage === lang.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="font-medium">{lang.label}</span>
                        {selectedLanguage === lang.id && (
                          <Check className="w-4 h-4 text-primary ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Timezone</h3>
                  <div className="space-y-2">
                    {timezones.map((tz) => (
                      <button
                        key={tz.id}
                        onClick={() => handleTimezoneChange(tz.id)}
                        className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between ${
                          selectedTimezone === tz.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <span className="font-medium">{tz.label}</span>
                        {selectedTimezone === tz.id && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <span className="font-medium">Email notifications</span>
                        <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                      </div>
                      <Switch
                        checked={emailNotifications}
                        onCheckedChange={(checked) => {
                          setEmailNotifications(checked);
                          toast.success("Preference saved");
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <span className="font-medium">Progress reminders</span>
                        <p className="text-sm text-muted-foreground">Get weekly reminders about your learning progress</p>
                      </div>
                      <Switch
                        checked={progressReminders}
                        onCheckedChange={(checked) => {
                          setProgressReminders(checked);
                          toast.success("Preference saved");
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <span className="font-medium">Marketing emails</span>
                        <p className="text-sm text-muted-foreground">Receive updates about new courses and offers</p>
                      </div>
                      <Switch
                        checked={marketingEmails}
                        onCheckedChange={(checked) => {
                          setMarketingEmails(checked);
                          toast.success("Preference saved");
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Push Notifications</h3>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <span className="font-medium">Browser notifications</span>
                      <p className="text-sm text-muted-foreground">Get notifications in your browser</p>
                    </div>
                    <Switch
                      checked={pushNotifications}
                      onCheckedChange={(checked) => {
                        setPushNotifications(checked);
                        toast.success(checked ? "Push notifications enabled" : "Push notifications disabled");
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Profile Visibility</h3>
                  <div className="space-y-2">
                    {["public", "private"].map((visibility) => (
                      <button
                        key={visibility}
                        onClick={() => {
                          setProfileVisibility(visibility);
                          toast.success(`Profile set to ${visibility}`);
                        }}
                        className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between ${
                          profileVisibility === visibility
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="text-left">
                          <span className="font-medium capitalize">{visibility}</span>
                          <p className="text-sm text-muted-foreground">
                            {visibility === "public" 
                              ? "Anyone can see your profile and progress" 
                              : "Only you can see your profile"
                            }
                          </p>
                        </div>
                        {profileVisibility === visibility && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <span className="font-medium">Activity tracking</span>
                    <p className="text-sm text-muted-foreground">Allow us to track your learning progress for personalized recommendations</p>
                  </div>
                  <Switch
                    checked={activityTracking}
                    onCheckedChange={(checked) => {
                      setActivityTracking(checked);
                      toast.success("Preference saved");
                    }}
                  />
                </div>
              </div>
            )}

            {/* Payment Tab */}
            {activeTab === "payment" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Subscription</h3>
                  <div className="p-6 rounded-xl border border-border bg-secondary/30">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium">Current Plan</p>
                        <p className="text-2xl font-bold text-primary">Free Tier</p>
                      </div>
                      <Link to="/#pricing">
                        <Button>Upgrade to Pro</Button>
                      </Link>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Upgrade to Pro to unlock all 50+ lessons and advanced features.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
                  <div className="p-6 rounded-xl border border-dashed border-border text-center">
                    <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No payment methods added yet</p>
                    <Button variant="outline">Add Payment Method</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Plugins Tab */}
            {activeTab === "plugins" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Connected Apps</h3>
                  <p className="text-muted-foreground mb-6">Connect third-party apps to enhance your learning experience.</p>
                  
                  <div className="space-y-3">
                    {[
                      { name: "Google Calendar", description: "Sync practice reminders", connected: false },
                      { name: "Discord", description: "Join our community server", connected: false },
                      { name: "Notion", description: "Export notes and progress", connected: false },
                    ].map((app) => (
                      <div
                        key={app.name}
                        className="p-4 rounded-xl border border-border flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{app.name}</p>
                          <p className="text-sm text-muted-foreground">{app.description}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toast.success(`${app.name} connection coming soon!`)}
                        >
                          Connect
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <EditProfileModal
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
        currentName={displayName}
        userId={user.id}
        onSuccess={refetchProfile}
      />
      <ChangePasswordModal
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />
      <DeleteAccountModal
        open={deleteAccountOpen}
        onOpenChange={setDeleteAccountOpen}
        userEmail={email}
        onConfirm={handleSignOut}
      />
    </div>
  );
};

export default Settings;
