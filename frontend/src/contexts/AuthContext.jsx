import { jwtDecode } from "jwt-decode";
import React, { createContext, useEffect, useMemo, useState } from "react";
export const AuthContext = createContext({
  token: null,
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  user: {
    id: "",
    email: "",
    type: ""
  },
  setUser: () => {},
  loading: true,
  fetchUserFromToken: ()=>{}
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [user, setUser] = useState({
    id: "",
    email: "",
    type: ""
  });

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  const fetchUserFromToken = () => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setIsAuthenticated(true);
      setToken(storedToken);
      const decodedToken = jwtDecode(storedToken);
      setUser({
        id: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
        email: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
        type: decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      });
    } else {
      setUser({
        id: "",
        email: "",
        type: ""
      });
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserFromToken();
    console.log(user);
    
  }, [token, isAuthenticated]);

  const authContextValue = useMemo(
    () => ({
      token,
      isAuthenticated,
      setIsAuthenticated,
      user,
      setUser,
      loading,
      fetchUserFromToken
    }),
    [token, user, isAuthenticated, loading]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
