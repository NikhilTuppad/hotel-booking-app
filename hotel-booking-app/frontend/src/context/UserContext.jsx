import {createContext, useEffect, useState} from "react";
import { getProfile } from "../api/authApi.js";

export const UserContext = createContext({});

export function UserContextProvider({children}) {
  const [user,setUser] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect( () => {
    if (!user) {
      getProfile().then(({data}) => {
        setUser(data);
        setReady(true);
      }).catch(err => {
        console.log(err);
        setReady(true);
      });
    }
  }, []);
  return (
    <UserContext.Provider value={{user,setUser,ready}}>
      {children}
    </UserContext.Provider>
  );
}