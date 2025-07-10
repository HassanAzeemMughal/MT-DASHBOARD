import generateSlice from "./actions/fetchData";

const generate = (name, fetchData) => {
  return generateSlice({ name, fetchData });
};

export default generate;
