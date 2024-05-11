// AuthContext.js

import { createContext, useContext, useState } from 'react';
import baseApi from "../../axios/baseApi";
import {useRouter} from "next/router";

// AuthContext oluştur
const AuthContext = createContext();

// AuthProvider bileşeni oluştur
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const {push} = useRouter()



  // Kullanıcı giriş yapınca setUser ile kullanıcıyı ayarla
  const login = (userData) => {
    setUser(userData);
  };

  // Kullanıcı çıkış yapınca setUser ile kullanıcıyı null yap
  const logout = async () => {
    const response = await baseApi.get('auth/logout');
    if(response.status === 200){
      localStorage.removeItem('token');
      setUser(null);
      return response
    }

  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth hook'u oluştur
export const useAuth = () => useContext(AuthContext);
