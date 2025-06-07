import { useState } from "react";
import { useNavigate } from "react-router";

export function LoginView(){

    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch(`/api/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });

    const user = await response.json();
    console.log(user)
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/lobby");
};

    return(
        <>
        <h3>ENTER A NAME</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <button type='submit'>Submit</button>
        </form>
        </>

    )
}