import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import axios from "../configs/axiosConfig";
import {
  auth_endpoint,
  filenames_endpoint,
  users_endpoint,
} from "../constants/endpoints";
import { dashboard_route } from "../constants/routes";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token"));
  const [fileNames, setFileNames] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("token")) setIsLoggedIn(true);
    else setIsLoggedIn(false);
  }, []);

  const login = async (credentials) => {
    try {
      const { data } = await axios.post(auth_endpoint, credentials);
      localStorage.setItem("token", data);
      setIsLoggedIn(true);
      navigate(dashboard_route);
    } catch (error) {
      setIsLoggedIn(false);
      toast.error("Nom d'utilisateur ou mot de passe incorrect");
    }
  };

  const SignUp = async (userInfo) => {
    try {
      const { headers } = await axios.post(users_endpoint, userInfo);

      const token = headers["x-auth-token"];

      localStorage.setItem("token", token);
      setIsLoggedIn(true);
      navigate(dashboard_route);
    } catch (error) {
      setIsLoggedIn(false);
      toast.error("quelque chose de mal arrive");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setFileNames([]);
  };

  const getFileNames = async () => {
    try {
      const { data } = await axios.get(filenames_endpoint);
      setFileNames(data);
    } catch (error) {}
  };

  const values = { isLoggedIn, login, SignUp, logout, fileNames, getFileNames };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export default AuthContextProvider;
