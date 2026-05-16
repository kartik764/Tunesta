import React, { createContext, useState, useEffect, useContext, use } from 'react'
import { toast } from 'react-toastify';

const Authcontext= createContext();

export const Authprovider = ({children})=>{
    const [User,setUser]=useState(null);
    const [Token, setToken]=useState(null);
    const [Authenticated, setAuthenticated]=useState(null);

    const[Loading,setLoading]=useState(true);


    // Auto login check.
    useEffect(() => {
      const userdata= sessionStorage.getItem("tunesta_user");
      const authtoken= sessionStorage.getItem("tunesta_usertoken");

     //if userdetails and authtoken both exist, that means the data is present in the local storage corresponding to a user, so we can make him login directly
     if(userdata && authtoken){
        setUser(userdata);
        setToken(authtoken);
        setAuthenticated(true); 
     }  

     //when login has been done, then set loading to false, that will mean that now you can show the website.  
    setLoading(false);
    }, []);
    
    // Login function.
    const login = (userData, authtoken)=>{
        // Setting up the states.
        setUser(userData);
        setToken(authtoken);
        setAuthenticated(true);   

        //Entering details into the sessionStorage of the browser.
        sessionStorage.setItem("tunesta_user", JSON.stringify(userData));
        sessionStorage.setItem("tunesta_usertoken", authtoken);
    }

    const logout = ()=>{
        
        setUser(null);
        setToken(null);
        setAuthenticated(false);

        //removing from the local storage
        sessionStorage.removeItem("tunesta_user");
        sessionStorage.removeItem("tunesta_usertoken"); 

    }

    // Eventually it is meaning that we have wrapped our whole App in Authcontex.provider that we had learned also. here children means to App but where ever we will be wrapping any element in the Authprovider that particular element will behave like a children and will be bringed here not just the app element.

    return(
        <Authcontext.Provider value={{User, Token, Authenticated, login, logout}}>
            {/* !Loading &&  */}
            {children}
        </Authcontext.Provider>
    )

}

// This is the strategy to make sure that whichever component wants to use the context does not have to import the usecontext file again and again they can directly use the useAuth function.
export const useAuth = ()=> useContext(Authcontext);



