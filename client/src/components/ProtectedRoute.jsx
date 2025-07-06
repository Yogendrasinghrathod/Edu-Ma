import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";

export const ProtectedRoute =({children})=>{
    const {isAuthenticated}=useSelector(store=>store.authSlice);

    if(!isAuthenticated){
        return <Navigate to ="/login"/>
    }

    return children;
}

export const AuthenticatedUser=({children})=>{
    const {isAuthenticated}=useSelector(store=>store.authSlice);

    if(!isAuthenticated){ 
        return <Navigate to ="/"/>
    }

    return children;

}



export const AdminRoute=({children})=>{
    const {isAuthenticated, user}=useSelector(store=>store.authSlice);

    if(!isAuthenticated){
        return <Navigate to="/login"/>
    }

    if(user?.accountType!=="Instructor"){
        return <Navigate to ="/"/>
    }

    return children;
}