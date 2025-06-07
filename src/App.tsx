// import { useEffect, useState } from "react";
import { Outlet } from "react-router";



function App() {
  // const navigate = useNavigate();

  // const [user,setUser] = useState('')
  // const [match,setMatch] =useState('')
  // useEffect(() => {
  //   if(!user) navigate('/');
  //   if(!match) navigate('/lobby')
  // }, [user])


  return(
    <>
      <h1>Tic-Tac-Toe</h1>
      <Outlet />
    </>
  )
}

export default App;
