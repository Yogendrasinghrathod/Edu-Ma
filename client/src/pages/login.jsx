import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { signInWithGoogle } from "../firebase";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authApi";
// console.log(useRegisterMutation);
import { Loader2 } from "lucide-react";
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

const Login = () => {
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });
  const [signupInput, setSignupInput] = useState({
    firstName: "",
    lastName: "",
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
      toast.success(registerData.message) || "signup successful";
      navigate("/");
    }
    if(registerError){
      toast.error(registerData.data.message) || "signup failed";
    }
    if(loginIsSuccess && loginData){
      toast.success(loginData.message) || "login successful";
      navigate("/");
    }
    if(loginError){
      toast.error(loginData.data.message) || "login failed";
    }
  },
  [loginIsLoading,registerIsLoading,loginData,registerData,loginError,registerError,loginIsSuccess,registerIsSuccess]);

  const handleSubmit = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;
    await action(inputData);
  };

  return (
    <div className="flex w-full justify-center items-center mt-20">
      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Signup</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Login to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  value={loginInput.email}
                  onChange={(e) => changeHandler(e, "login")}
                  placeholder="xyz@gmail.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  value={loginInput.password}
                  onChange={(e) => changeHandler(e, "login")}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                disabled={loginIsLoading}
                onClick={() => handleSubmit("login")}
              >
                {loginIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Create a new account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-firstName">firstName</Label>
                <Input
                  id="signup-firstName"
                  name="firstName"
                  value={signupInput.firstName}
                  onChange={(e) => changeHandler(e, "signup")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-lastName">lastName</Label>
                <Input
                  id="signup-lastName"
                  name="lastName"
                  value={signupInput.lastName}
                  onChange={(e) => changeHandler(e, "signup")}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  value={signupInput.email}
                  onChange={(e) => changeHandler(e, "signup")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  value={signupInput.password}
                  onChange={(e) => changeHandler(e, "signup")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirmPassword">Confirm Password</Label>
                <Input
                  id="signup-confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={signupInput.ConfirmPassword}
                  onChange={(e) => changeHandler(e, "signup")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-accountType">AccountType</Label>
                <select
                  id="signup-accountType"
                  name="accountType"
                  value={signupInput.accountType}
                  onChange={(e) => changeHandler(e, "signup")}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="Student">Student</option>
                  <option value="Instructor">Instructor</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                disabled={registerIsLoading}
                onClick={() => handleSubmit("signup")}
              >
                {registerIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
              <button
                className="w-full mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={signInWithGoogle}
              >
                Sign in with Google
              </button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;