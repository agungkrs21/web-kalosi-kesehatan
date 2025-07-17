import { Navigate } from "react-router-dom";

const Login = () => {
  const user = false;

  if (user) return <Navigate to="/" />;

  return <p>Login</p>;
};

export default Login;
