import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Home, Phone, User, Building, Users, Loader2, ArrowLeft } from "lucide-react";
import { z } from "zod";

// Indian mobile number validation (10 digits, starting with 6-9)
const phoneSchema = z.string()
  .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number");
const nameSchema = z.string().min(2, "Name must be at least 2 characters");

type AuthMode = "login" | "signup";
type AuthStep = "phone" | "otp";
type UserRole = "tenant" | "property_owner";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signInWithPhone, verifyOtp, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [mode, setMode] = useState<AuthMode>(location.pathname === "/signup" ? "signup" : "login");
  const [step, setStep] = useState<AuthStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>("tenant");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; name?: string; otp?: string }>({});
  const [resendTimer, setResendTimer] = useState(0);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  // Update mode based on URL
  useEffect(() => {
    setMode(location.pathname === "/signup" ? "signup" : "login");
    setStep("phone");
    setOtp("");
  }, [location.pathname]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const validatePhoneForm = () => {
    const newErrors: { phone?: string; name?: string } = {};

    try {
      phoneSchema.parse(phone);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.phone = e.errors[0].message;
      }
    }

    if (mode === "signup") {
      try {
        nameSchema.parse(fullName);
      } catch (e) {
        if (e instanceof z.ZodError) {
          newErrors.name = e.errors[0].message;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePhoneForm()) return;

    setLoading(true);

    try {
      const formattedPhone = `+91${phone}`;
      const { error } = await signInWithPhone(formattedPhone, mode === "signup" ? { fullName, role } : undefined);
      
      if (error) {
        toast({
          title: "Failed to send OTP",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setStep("otp");
        setResendTimer(30);
        toast({
          title: "OTP sent!",
          description: `We've sent a 6-digit code to +91 ${phone}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setErrors({ otp: "Please enter the complete 6-digit OTP" });
      return;
    }

    setLoading(true);

    try {
      const formattedPhone = `+91${phone}`;
      const { error } = await verifyOtp(formattedPhone, otp);
      
      if (error) {
        setErrors({ otp: "Invalid or expired OTP. Please try again." });
        toast({
          title: "Verification failed",
          description: "The OTP you entered is invalid or has expired.",
          variant: "destructive",
        });
      } else {
        toast({
          title: mode === "login" ? "Welcome back!" : "Account created!",
          description: mode === "login" ? "You have successfully logged in." : "Welcome to Stazy!",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    setLoading(true);
    try {
      const formattedPhone = `+91${phone}`;
      const { error } = await signInWithPhone(formattedPhone);
      
      if (error) {
        toast({
          title: "Failed to resend OTP",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setResendTimer(30);
        setOtp("");
        toast({
          title: "OTP resent!",
          description: `We've sent a new 6-digit code to +91 ${phone}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setOtp("");
    setErrors({});
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Simple header */}
      <header className="p-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Home className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Stazy</span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-elevated animate-fade-up">
          <CardHeader className="text-center space-y-2">
            {step === "otp" && (
              <button
                onClick={handleBackToPhone}
                className="absolute left-4 top-4 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <CardTitle className="text-2xl font-bold">
              {step === "phone" 
                ? (mode === "login" ? "Welcome back" : "Create an account")
                : "Verify your number"
              }
            </CardTitle>
            <CardDescription>
              {step === "phone"
                ? (mode === "login"
                    ? "Enter your mobile number to continue"
                    : "Join Stazy to find or list rooms")
                : `Enter the 6-digit code sent to +91 ${phone}`
              }
            </CardDescription>
          </CardHeader>

          {step === "phone" ? (
            <form onSubmit={handleSendOtp}>
              <CardContent className="space-y-4">
                {mode === "signup" && (
                  <>
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="John Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name}</p>
                      )}
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-2">
                      <Label>I want to...</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setRole("tenant")}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            role === "tenant"
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-muted-foreground/30"
                          }`}
                        >
                          <Users className={`w-6 h-6 mx-auto mb-2 ${role === "tenant" ? "text-primary" : "text-muted-foreground"}`} />
                          <p className={`text-sm font-medium ${role === "tenant" ? "text-primary" : "text-foreground"}`}>
                            Find a Room
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            I'm looking to rent
                          </p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole("property_owner")}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            role === "property_owner"
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-muted-foreground/30"
                          }`}
                        >
                          <Building className={`w-6 h-6 mx-auto mb-2 ${role === "property_owner" ? "text-primary" : "text-muted-foreground"}`} />
                          <p className={`text-sm font-medium ${role === "property_owner" ? "text-primary" : "text-foreground"}`}>
                            List Rooms
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            I have rooms to rent
                          </p>
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number</Label>
                  <div className="relative flex">
                    <div className="flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md text-sm text-muted-foreground">
                      +91
                    </div>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setPhone(value);
                        }}
                        className="pl-10 rounded-l-none"
                        maxLength={10}
                      />
                    </div>
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    We'll send you a one-time verification code
                  </p>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Get OTP"
                  )}
                </Button>

                <p className="text-sm text-center text-muted-foreground">
                  {mode === "login" ? (
                    <>
                      Don't have an account?{" "}
                      <Link to="/signup" className="text-primary hover:underline font-medium">
                        Sign up
                      </Link>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <Link to="/login" className="text-primary hover:underline font-medium">
                        Log in
                      </Link>
                    </>
                  )}
                </p>
              </CardFooter>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <CardContent className="space-y-6">
                {/* OTP Input */}
                <div className="flex flex-col items-center space-y-4">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => {
                      setOtp(value);
                      setErrors({});
                    }}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  {errors.otp && (
                    <p className="text-sm text-destructive">{errors.otp}</p>
                  )}
                </div>

                {/* Resend OTP */}
                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Resend code in <span className="font-medium text-foreground">{resendTimer}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="text-sm text-primary hover:underline font-medium disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Continue"
                  )}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Auth;
