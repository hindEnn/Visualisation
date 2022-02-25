import { createContext, useContext, useState } from "react";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import axios from "../configs/axiosConfig";
import { filenames_endpoint, files_endpoint } from "../constants/endpoints";
import { dashboard_route } from "../constants/routes";

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [fileNames, setFileNames] = useState([]);
  const [file, setFile] = useState({});
  const navigate = useNavigate();

  const getFileNames = async () => {
    try {
      const { data } = await axios.get(filenames_endpoint);
      setFileNames(data.map((arr) => ({ label: arr, value: arr })));
      getData(data[0]);
    } catch (error) {}
  };

  const getData = async (value) => {
    try {
      const { data } = await axios.get("/api/files/", {
        params: {
          file: value,
        },
      });
      setFile(data);
    } catch (error) {}
  };

  const createFile = async (value) => {
    try {
      await axios.post(files_endpoint, value);
      toast.success("le fichier a été enregistré avec succès");
      navigate(dashboard_route);
    } catch (error) {
      toast.error("quelque chose de mal arrive");
    }
  };

  const values = {
    fileNames,
    getFileNames,
    getData,
    createFile,
    file,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};

export default AppContextProvider;
