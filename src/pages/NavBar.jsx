import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const { handleLogout } = useAuth();
  return (
    <div>
      <h1>Hello baruuuu</h1>
      <button onClick={handleLogout}>Log out bruh</button>
    </div>
  );
};

export default NavBar;
