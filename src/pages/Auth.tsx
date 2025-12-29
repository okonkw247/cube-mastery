import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import jsnLogo from "@/assets/jsn-logo.png";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(mode !== "signup");
  const [isReset, setIsReset] = useState(mode === "reset" || mode === "forgot");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle, resetPassword, updatePassword, user, loading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const currentMode = searchParams.get("mode");
    setIsLogin(currentMode !== "signup");
    setIsReset(currentMode === "reset" || currentMode === "forgot");
  }, [searchParams]);

  // Redirect if already logged in (except for password reset)
  useEffect(() => {
    if (!loading && user && !isReset) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate, isReset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Handle password reset flow
      if (isReset) {
        if (mode === "reset" && user) {
          // User is updating password after clicking email link
          if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            setIsLoading(false);
            return;
          }
          if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            setIsLoading(false);
            return;
          }
          const { error } = await updatePassword(formData.password);
          if (error) {
            toast.error(error.message);
            setIsLoading(false);
            return;
          }
          toast.success("Password updated successfully!");
          navigate("/dashboard");
        } else {
          // User is requesting password reset email
          const { error } = await resetPassword(formData.email);
          if (error) {
            toast.error(error.message);
            setIsLoading(false);
            return;
          }
          toast.success("Password reset email sent! Check your inbox.");
          setIsReset(false);
          setIsLogin(true);
        }
        setIsLoading(false);
        return;
      }

      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Invalid email or password");
          } else {
            toast.error(error.message);
          }
          setIsLoading(false);
          return;
        }
        toast.success("Welcome back!");
      } else {
        if (formData.password.length < 6) {
          toast.error("Password must be at least 6 characters");
          setIsLoading(false);
          return;
        }
        const { error } = await signUp(formData.email, formData.password, formData.name);
        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("This email is already registered. Please sign in.");
          } else {
            toast.error(error.message);
          }
          setIsLoading(false);
          return;
        }
        toast.success("Account created successfully!");
      }
      navigate("/dashboard");
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Password update form (after clicking email link)
  if (isReset && mode === "reset" && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e] p-6 relative overflow-hidden">
        {/* Background gradient shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23]" />
          <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[100px]" />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Auth Card */}
          <div className="bg-[#2d2d44]/90 backdrop-blur-xl rounded-xl p-8 border border-white/10 shadow-2xl">
            {/* Logo */}
            <div className="flex items-center gap-3 justify-center mb-8">
              <img src={jsnLogo} alt="JSN Logo" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold text-white">JSN Cubing</span>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2 text-white">Set New Password</h1>
              <p className="text-gray-400">Enter your new password below</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-11 pr-11 h-12 bg-[#1a1a2e] border-white/10 text-white placeholder:text-gray-500"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-11 h-12 bg-[#1a1a2e] border-white/10 text-white placeholder:text-gray-500"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-pulse">Updating...</span>
                ) : (
                  <>
                    Update Password
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e] p-6 relative overflow-hidden">
      {/* Background gradient shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23]" />
        <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Auth Card */}
        <div className="bg-[#2d2d44]/90 backdrop-blur-xl rounded-xl p-8 border border-white/10 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center gap-3 justify-center mb-8">
            <img src={jsnLogo} alt="JSN Logo" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold text-white">JSN Cubing</span>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2 text-white">
              {isReset ? "Reset Password" : isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-gray-400">
              {isReset
                ? "Enter your email to receive a reset link"
                : isLogin
                ? "Sign in to continue your cubing journey"
                : "Start mastering the Rubik's Cube today"}
            </p>
          </div>

          {/* Google Sign In */}
          {!isReset && (
            <>
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 gap-3 mb-6 bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
                onClick={handleGoogleSignIn}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#2d2d44] px-3 text-gray-400">Or continue with</span>
                </div>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && !isReset && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-11 h-12 bg-[#1a1a2e] border-white/10 text-white placeholder:text-gray-500"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-11 h-12 bg-[#1a1a2e] border-white/10 text-white placeholder:text-gray-500"
                  required
                />
              </div>
            </div>

            {!isReset && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setIsReset(true)}
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-11 pr-11 h-12 bg-[#1a1a2e] border-white/10 text-white placeholder:text-gray-500"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  {isReset ? "Send Reset Link" : isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            {isReset ? (
              <p className="text-gray-400">
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => setIsReset(false)}
                  className="text-primary font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p className="text-gray-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary font-semibold hover:underline"
                >
                  {isLogin ? "Create account" : "Sign in"}
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>

        {/* Footer links */}
        <div className="flex items-center justify-center gap-6 mt-8 text-xs text-gray-500">
          <span>Terms of use</span>
          <span>Privacy policy</span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
