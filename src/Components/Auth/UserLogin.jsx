import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "../../utils/axiosConfig";
import toast from "react-hot-toast";
import { Eye, EyeOff, Lock, Mail, User, Briefcase, Users, Trophy } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import { Separator } from "../../components/ui/separator";
const backendUrl = import.meta.env?.VITE_API_URL;

const UserLogin = ({ isOpen, onClose }) => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Using user-specific state setters from AppContext
  const {
    fetchUserFromCookie,
    setShowUserLogin,
    setUserData,
    setIsUserAuthenticated,
    fetchUserJobApplications,
  } = useContext(AppContext);
  // 👇 Google Auth response handler
  const responseGoogle = async (authResult) => {
    console.log("Google Auth Result:", authResult);
    try {

      if (authResult?.code) {
        // Sending the authorization code to the backend using axios
        const result = await axios.post(`${backendUrl}/api/users/google-auth`, {
          code: authResult.code, // Sending the Google OAuth code to the backend
        });

        const { name, email, image } =  result.data.user;

        const userObj = { name, email, image };

        setUserData(userObj);
        fetchUserFromCookie();

        localStorage.setItem("boolC", JSON.stringify(true));
        setIsUserAuthenticated(true);
        await fetchUserJobApplications();

        toast.success("Google login successful!");
        setShowUserLogin(false);
        onClose();
        // navigate("/dashboard");
        // optional based on flow
      }
    } catch (error) {
      console.error("Google Auth error:", error);
      toast.error("Google login failed. Try again.");
    }
  };
  // 👇 Google Login hook
  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  useEffect(() => {
    // Prevent scrolling when modal is open
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // 👇 Call this in JSX or a button:
  const handleGoogleLogin = () => {
    googleLogin(); // triggers the Google OAuth popup
  };
  

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (state === "signup") {
      // Regular Expression: Allow only letters, spaces, and hyphens
      const nameRegex = /^[A-Za-z][A-Za-z\s'-]{1,49}$/;

      // Check for empty name or special characters
      if (name.trim().length < 2) {
        toast.error("Name must be at least 2 characters long.");
        setLoading(false);
        return;
      }

      // Check for special characters (only letters, spaces, and hyphens allowed)
      if (!nameRegex.test(name.trim())) {
        toast.error(
          "Special characters or Number not allowed in Name. Only letters, spaces, and hyphens are allowed."
        );
        setLoading(false);
        return;
      }
    }
    // Basic email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Basic Password Validation
    const invalidCharRegex = /[^A-Za-z\d@$!%*?&]/g;

    if (state == "signup") {
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters long.");
        return;
      }

      const invalidMatches = password.match(invalidCharRegex);
      if (invalidMatches) {
        const uniqueInvalids = [...new Set(invalidMatches)];
        toast.error(` ${uniqueInvalids.join(", ")}: Invalid character${
          uniqueInvalids.length > 1 ? "s" : ""
        } 
          Allowed Only: @ $ ! % * ? &`);
        return;
      }
    }

    setLoading(true);

    try {
      if (state === "login") {
        // User Login API call
        const { data } = await axios.post(
          `${backendUrl}/api/users/user-login`,
          { email, password }
        );
        // ✅ this triggers update in EductionForm
        // navigate or do whatever next
        if (data.success) {
          localStorage.setItem("boolC", JSON.stringify(true));
          fetchUserFromCookie();
          setUserData(data.user);
          setIsUserAuthenticated(true);
          await fetchUserJobApplications();
          toast.dismiss();
          toast.success("Logged in successfully!");
          setShowUserLogin(false);
          onClose();
        } else {
          toast.error(data.message);
        }
      } else if (state === "signup") {
        // User Signup API call
        const { data } = await axios.post(
          `${backendUrl}/api/users/user-register`,
          { name, email, password }
        );

        if (data.success) {
          localStorage.setItem("boolC", JSON.stringify(true));
          fetchUserFromCookie();
          setUserData(data.user);
          setIsUserAuthenticated(true);
          toast.success("Account created successfully!");
          setShowUserLogin(false);
          onClose();
        } else {
          toast.error(data.message);
        }
      } else if (state === "forgot") {
        // Forgot Password API call
        const { data } = await axios.post(
          `${backendUrl}/api/user/forgot-password`,
          { email }
        );

        if (data.success) {
          toast.success("Password reset link sent to your email!");
          setState("login");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error("Error in API call:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 gap-0 border-0">
        <div className="flex min-h-[600px]">
          {/* Left side - Features */}
          <div className="relative hidden md:flex w-1/2 bg-legpro-primary p-8 text-white overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute w-32 h-32 bg-white/10 rounded-full top-10 left-10"></div>
              <div className="absolute w-24 h-24 bg-white/5 rounded-full bottom-20 right-20"></div>
              <div className="absolute w-16 h-16 bg-white/5 rounded-full bottom-10 left-10"></div>
              <div className="absolute w-20 h-20 bg-white/10 rounded-full top-32 right-10"></div>
            </div>
            
            <div className="relative z-10 flex flex-col justify-center">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <h1 className="text-3xl font-bold">Job Mela</h1>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm mt-1">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Connect with Top Companies</h3>
                      <p className="text-blue-100">Join thousands of professionals finding their dream jobs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm mt-1">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Career Growth</h3>
                      <p className="text-blue-100">Unlock opportunities that match your skills and aspirations</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm mt-1">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Easy Applications</h3>
                      <p className="text-blue-100">Apply to multiple jobs with just one click</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="w-full md:w-1/2 p-8 bg-white">
            <Card className="border-0 shadow-none">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold">
                  {state === "login"
                    ? "Welcome Back"
                    : state === "signup"
                    ? "Create Account"
                    : "Reset Password"}
                </CardTitle>
                <CardDescription>
                  {state === "login"
                    ? "Sign in to your Job Mela account"
                    : state === "signup"
                    ? "Join Job Mela and discover your next opportunity"
                    : "Enter your email to reset your password"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {state === "signup" && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10"
                          placeholder="Your full name"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  {state !== "forgot" && (
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10"
                          placeholder="********"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {state === "login" && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setState("forgot")}
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : state === "login" ? (
                      "Sign In"
                    ) : state === "signup" ? (
                      "Create Account"
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </form>
                {state !== "forgot" && (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleLogin}
                      className="w-full"
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Continue with Google
                    </Button>
                  </>
                )}

                <div className="text-center text-sm">
                  {state === "login" ? (
                    <p className="text-muted-foreground">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setState("signup")}
                        className="text-primary hover:underline font-medium"
                      >
                        Sign up
                      </button>
                    </p>
                  ) : state === "signup" ? (
                    <p className="text-muted-foreground">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setState("login")}
                        className="text-primary hover:underline font-medium"
                      >
                        Sign In
                      </button>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setState("login")}
                      className="text-primary hover:underline"
                    >
                      Back to Login
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserLogin;
