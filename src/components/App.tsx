import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if(!stored) navigate('/')
    console.log(stored)
  }, []);

  return (
    <>
      <h1>Tic-Tac-Toe</h1>
      <Outlet />
    </>
  );
}

export default App;
