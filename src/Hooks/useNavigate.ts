import { useContext } from "react";
import { RouterContext } from "Contexts";

export const useNavigate = () => {
  const router = useContext(RouterContext);
  return router.navigate.bind(router);
};
