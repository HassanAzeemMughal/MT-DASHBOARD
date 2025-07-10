import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { REACT_BACKEND_PATH } from "../config";

export const fetchDataThunk = (name, api) => {
  return createAsyncThunk(name, async (params) => {
    const url = `${REACT_BACKEND_PATH}${api}${
      params?.id ? `${params?.id}` : "?"
    }`;
    console.log("Fetching URL:", url);

    const token = localStorage.getItem("authToken");
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Access-Control-Allow-Origin", "*");
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("Access-Control-Allow-Credentials", "true");
    const response = await fetch(url, {
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(errorText);
    }

    const data = await response.json();
    return data;
  });
};
export const addData = (name, api) => {
  return createAsyncThunk(name, async (params) => {
    const url = `${REACT_BACKEND_PATH}${api}`;
    const response = await fetch(url, {
      credentials: "include",
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
        Authorization: "",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  });
};
const generateSlice = ({ name, fetchData }) => {
  const initialState = {
    data: [],
    total: 0,
    isLoading: false,
    isError: false,
  };

  const slice = createSlice({
    name,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(fetchData.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      });
      builder.addCase(fetchData.fulfilled, (state, action) => {
        //@ts-ignore
        state.data = action?.payload?.data;
        state.total = action?.payload?.total;
        state.isLoading = false;
        state.isError = false;
      });
      builder.addCase(fetchData.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
    },
  });

  return slice.reducer;
};
export default generateSlice;
