import axios from "axios";
import { API_URL } from "../../config";
import { isValidJson } from "@/utils/commonFunctions";

const CreateUserInstance = () => {
  let token = null;
  if (typeof window !== 'undefined') {
    const authUser = localStorage.getItem("authUser");
    if (isValidJson(authUser)) {
      const parsedUser = JSON.parse(authUser);
      token = parsedUser?.token;
    }
  }
     
  const userInstance = axios.create({
    baseURL: API_URL
  });

  userInstance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return userInstance;
};

export default CreateUserInstance;

