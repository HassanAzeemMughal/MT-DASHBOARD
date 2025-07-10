import axios from "axios";

// Base URL of your API (you can change this as per your environment)
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;
// Create an axios instance for reusable requests
const api = axios.create({
  baseURL: API_BASE_URL,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// Add request interceptor (optional - for attaching auth tokens or logging)
// api.interceptors.request.use(
//   (config) => {
//     // Example: If you have a JWT token, you can add it to request headers
//     const token = localStorage.getItem("authToken"); // Replace with your method of retrieving the token
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     // Handle the error
//     return Promise.reject(error);
//   }
// );

// Add response interceptor to handle responses globally
api.interceptors.response.use(
  (response) => {
    // You can manipulate the response data if necessary
    return response.data; // Return the response data directly to avoid manual .data access
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 400:
          console.error("Bad Request:", error.response.data);
          break;
        case 401:
          console.error("Unauthorized:", error.response.data);
          // Redirect to login page if not authenticated (for example)
          break;
        case 404:
          console.error("Not Found:", error.response.data);
          break;
        case 500:
          console.error("Server Error:", error.response.data);
          break;
        default:
          console.error("Unknown Error:", error.response.data);
          break;
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request setup error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Generic API methods (GET, POST, PUT, DELETE)

const get = async (url, params = {}) => {
  try {
    const response = await api.get(url, { params });
    return response; // Return the response data directly
  } catch (error) {
    throw error; // Forward error for further handling if needed
  }
};

const post = async (url, data = {}) => {
  try {
    const response = await api.post(url, data);
    return response; // Return the response data directly
  } catch (error) {
    throw error;
  }
};

const put = async (url, data = {}) => {
  try {
    const response = await api.put(url, data);
    return response; // Return the response data directly
  } catch (error) {
    throw error;
  }
};

const del = async (url, data = {}) => {
  try {
    const response = await api.delete(url, { data });
    return response; // Return the response data directly
  } catch (error) {
    throw error;
  }
};

// File Upload Method
const uploadFile = async (url, fileData, folder = "general", fileId = "") => {
  try {
    const formData = new FormData();
    formData.append("file", fileData);
    formData.append("folder", folder);
    formData.append("fileId", fileId);

    const response = await api.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensure it's multipart/form-data
      },
    });

    return response; // Return the response data directly
  } catch (error) {
    throw error;
  }
};

// Export the methods
export default {
  get,
  post,
  put,
  del,
  uploadFile,
};
