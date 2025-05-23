import "./App.css";
// import {Button} from './components/ui/button'
import Login from "./pages/login";
import Navbar from "./components/Navbar";
import HeroSection from "./pages/student/HeroSection";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Courses from "./pages/student/Courses";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import { LogOut } from "lucide-react";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Courses />
          </>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/myLearning",
        element:<MyLearning/>,

      },
      {
        path: "/profile",
        element:<Profile/>,

      },
      
    ],
  },
]);

function App() {
  return (
    <main>
      {/* <Button >Lets start</Button> */}
      <RouterProvider router={appRouter}/>
    </main>
  );
}

export default App;
