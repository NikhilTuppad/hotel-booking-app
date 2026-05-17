import { useContext, useState } from "react"
import { UserContext } from "../context/UserContext.jsx"
import { Navigate, useParams } from "react-router-dom";
import { Link , useLocation} from "react-router-dom";
import { logoutUser } from "../api/authApi.js";
import PlacesPage from "./PlacesPage.jsx";
import AccountNav from "../components/layout/AccountNav.jsx";
import Dashboard from "../components/dashboard/Dashboard.jsx";


export default function ProfilePage(){
    const {ready,user,setUser}= useContext(UserContext);
    const [redirect,setRedirect] = useState(null);

    const {pathname} = useLocation();
    let subpage = pathname.split('/')?.[2];

    if (subpage === undefined) {
        subpage = 'profile';
    }

    async function logout() {
        await logoutUser();
        setRedirect('/');
        setUser(null)
      }

    if(!ready){
        return 'Loading....';
    }
    if(ready && !user && !redirect){
        return <Navigate to={'/login'} />
    }

    if(redirect){
        return <Navigate to={redirect}/>
    }

    return (
        <div>
            <AccountNav/>
            {subpage === 'profile' && (
                <Dashboard user={user} logoutFn={logout} />
            )}

            {subpage === 'places' && (
                <PlacesPage/>
            )}
            
        </div>
    )
}