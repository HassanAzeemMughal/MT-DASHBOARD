import { useNavigate } from "react-router-dom";
import { REACT_BACKEND_PATH } from "../config";
import { notification } from "antd";

export const authApi = async (
  dispatch,
  data,
  setToken,
  setLoginData,
  setLoader,
  router,
  setError // Accept error setter
) => {
  setLoader(true);
  setError(""); // Reset previous error

  try {
    const checkData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v.trim() !== "")
    );

    const response = await fetch(`${REACT_BACKEND_PATH}auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(checkData),
    });

    const responseData = await response.json();
    if (responseData.success === true) {
      setLoader(false);
      dispatch(setToken(responseData?.authToken));
      dispatch(setLoginData(responseData.user));
      notification.success({
        message: "Success",
        description: responseData.message || "Something went wrong",
        placement: "topRight",
      });
      router("/dashboard");
    } else {
      setLoader(false);
      setError(responseData.error || "Invalid login details");
    }
  } catch (error) {
    setLoader(false);
    setError("Network error. Please try again later.");
  }
};
