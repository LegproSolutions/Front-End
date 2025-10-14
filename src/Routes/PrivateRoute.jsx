import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const PrivateRoute = () => {
  const { isAuthenticated, isAuthLoading, setLoginOpen } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated === false) {
      setLoginOpen(true);
      navigate("/");
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  if (isAuthLoading || isAuthenticated === null) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <ClipLoader color="#123abc" size={100} />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : null;
};

export default PrivateRoute;
