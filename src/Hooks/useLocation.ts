import { useContext } from "react";
import { LocationContext } from "Contexts";

export const useLocation = () => {
  return useContext(LocationContext);
};
