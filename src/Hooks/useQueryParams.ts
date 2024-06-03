import { useContext } from "react";
import { ParamsContext } from "Contexts";

export const useQueryParams = () => {
  return useContext(ParamsContext);
};
