import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { signInWithGoogle } from "../firebase";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authApi";
import {
  Loader2,
  Mail,
  Lock,
  User,
  UserCircle,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "@/features/authSlice";

const Login = () => {
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });
  const [signupInput, setSignupInput] = useState({
    name:"",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "Student",
  });

  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
    },
  ] = useRegisterUserMutation();

  const navigate = useNavigate();
  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginUserMutation();

  const dispatch = useDispatch();

  const changeHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  useEffect(() => {
    if (registerIsSuccess && registerData) {
      toast.success(registerData.message || "Signup successful");
      navigate("/");
    }
    if (registerError) {
      toast.error(registerError?.data?.message || "Signup failed");
    }
    if (loginIsSuccess && loginData) {
      localStorage.setItem("user", JSON.stringify(loginData.user));
      toast.success(loginData.message || "Login successful");
      navigate("/");
      window.location.reload();
      // setAuthState({ isAuthenticated: true, user: loginData.user });
    }
    if (loginError) {
      toast.error(loginError?.data?.message || "Login failed");
    }
  }, [
    loginIsLoading,
    registerIsLoading,
    loginData,
    registerData,
    loginError,
    registerError,
    loginIsSuccess,
    registerIsSuccess,
    navigate,
  ]);

  const handleSubmit = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;
    await action(inputData);
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log("🚀 Initiating Google Sign-In...");
      const data = await signInWithGoogle();
      
      if (data && data.success) {
        console.log("✅ Google Sign-In Successful. Dispatching to Redux...");
        dispatch(userLoggedIn({ user: data.user, token: data.token }));
        toast.success(data.message || "Logged in successfully!");
        navigate("/");
        // Force a page reload to ensure Redux state is properly synchronized
        window.location.reload();
      } else {
        // This else block might not be necessary if signInWithGoogle throws errors, but it's good for safety.
        console.error("❌ Google Sign-In failed:", data?.message);
        toast.error(data?.message || "Google Sign-In failed. Please try again.");
      }
    } catch (error) {
      console.error("❌ An error occurred during Google Sign-In:", error);
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="flex w-full justify-center items-center min-h-[calc(100vh-6rem)] bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4 pt-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Welcome to Edu-
            <span className="text-blue-600 dark:text-blue-400">Ma</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your journey to knowledge begins here
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-blue-100/50 dark:bg-gray-800 rounded-lg p-1">
            <TabsTrigger
              value="login"
              className="rounded-md text-sm font-medium px-4 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm transition-all"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="rounded-md text-sm font-medium px-4 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm transition-all"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="border-none shadow-lg bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-center text-gray-800 dark:text-white">
                  Login
                </CardTitle>
                <CardDescription className="text-center text-gray-500 dark:text-gray-400">
                  Access your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="login-email"
                    className="text-gray-700 dark:text-gray-300 font-medium"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      value={loginInput.email}
                      onChange={(e) => changeHandler(e, "login")}
                      placeholder="your.email@example.com"
                      required
                      className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label
                      htmlFor="login-password"
                      className="text-gray-700 dark:text-gray-300 font-medium"
                    >
                      Password
                    </Label>
                    <a
                      href="#"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      value={loginInput.password}
                      onChange={(e) => changeHandler(e, "login")}
                      placeholder="••••••••"
                      required
                      className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-2">
                <Button
                  className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
                  disabled={loginIsLoading}
                  onClick={() => handleSubmit("login")}
                >
                  {loginIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>

                <div className="relative w-full flex items-center gap-2 my-2">
                  <div className="flex-grow h-px bg-gray-200 dark:bg-gray-700"></div>
                  <span className="text-sm text-gray-400">or</span>
                  <div className="flex-grow h-px bg-gray-200 dark:bg-gray-700"></div>
                </div>

                <button
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 border border-gray-300 rounded-lg transition-colors"
                  onClick={handleGoogleSignIn}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
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
                  Sign in with Google
                </button>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Don't have an account?
                  <a
                    href="#"
                    className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                  >
                    Sign up now
                  </a>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="border-none shadow-lg bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-center text-gray-800 dark:text-white">
                  Create an Account
                </CardTitle>
                <CardDescription className="text-center text-gray-500 dark:text-gray-400">
                  Join our learning community today
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="">
                  <div className="space-y-2">
                    <Label
                      htmlFor="signup-name"
                      className="text-gray-700 dark:text-gray-300 font-medium"
                    >
                      Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input
                        id="signup-name"
                        name="name"
                        value={signupInput.name}
                        onChange={(e) => changeHandler(e, "signup")}
                        placeholder="yuvi ji"
                        required
                        className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="signup-email"
                    className="text-gray-700 dark:text-gray-300 font-medium"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      value={signupInput.email}
                      onChange={(e) => changeHandler(e, "signup")}
                      placeholder="your.email@example.com"
                      required
                      className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="signup-password"
                    className="text-gray-700 dark:text-gray-300 font-medium"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      value={signupInput.password}
                      onChange={(e) => changeHandler(e, "signup")}
                      placeholder="••••••••"
                      required
                      className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="signup-confirmPassword"
                    className="text-gray-700 dark:text-gray-300 font-medium"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <CheckCircle className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="signup-confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={signupInput.confirmPassword}
                      onChange={(e) => changeHandler(e, "signup")}
                      placeholder="••••••••"
                      required
                      className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="signup-accountType"
                    className="text-gray-700 dark:text-gray-300 font-medium"
                  >
                    Account Type
                  </Label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <select
                      id="signup-accountType"
                      name="accountType"
                      value={signupInput.accountType}
                      onChange={(e) => changeHandler(e, "signup")}
                      className="w-full pl-10 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700 dark:text-gray-200 appearance-none"
                    >
                      <option value="Student">Student</option>
                      <option value="Instructor">Instructor</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-2">
                <Button
                  className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
                  disabled={registerIsLoading}
                  onClick={() => handleSubmit("signup")}
                >
                  {registerIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <div className="relative w-full flex items-center gap-2 my-2">
                  <div className="flex-grow h-px bg-gray-200 dark:bg-gray-700"></div>
                  <span className="text-sm text-gray-400">or</span>
                  <div className="flex-grow h-px bg-gray-200 dark:bg-gray-700"></div>
                </div>

                <button
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 border border-gray-300 rounded-lg transition-colors"
                  onClick={handleGoogleSignIn}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
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
                  Sign up with Google
                </button>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Already have an account?
                  <a
                    href="#"
                    className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                  >
                    Login
                  </a>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
