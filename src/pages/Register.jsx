import { User,Lock, LogIn, UserRoundPlus, AtSign } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function Register() {
    const navigate = useNavigate();


  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
   const [roles, setRoles] = useState("");
const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setRoles(e.target.value);
  };


   const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!username || !email || !password || !roles) {
      setMessage("Please fill all fields and select a role.");
      return;
    }

    try {
      const response = await api.post("/api/register/", {
        username: username,
        email: email,
        password: password,
        role: roles,
      });

      setMessage("Registration successful!");

      alert("Registration successful ✅");

      setUsername("");
      setEmail("");
      setPassword("");
      setRoles("");

      navigate("/login");
    } catch (error) {
      console.error(error);

      if (error.response && error.response.data) {
        setMessage(JSON.stringify(error.response.data));
      } else {
        setMessage("Registration failed.");
      }
    }
  };


  return (
    <div style={{
      height: "100vh",
      display:"flex",
      justifyContent: "center",
      alignItems: "center"}}>

      <form className="form" onSubmit={handleSubmit}>
      <h2 id="heading">Register</h2>
        <div className="field">
       <User/>
        <input
          placeholder="Username"
          className="input-field"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

<div className="field">

       <AtSign />

        <input
          placeholder="Email"
          className="input-field"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

      </div>

<div className="field">

       <Lock />

        <input
          placeholder="Password"
          className="input-field"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

      </div>
        
<div className="field">

       

        <h4>Select Your Role</h4>

      <label>
        <input
          type="radio"
          value="student"
          checked={roles==="student"}
          onChange={handleChange}
        />
        Student
      </label>

      <br />

      <label>
        <input
          type="radio"
          value="instructor"
          checked={roles==="instructor"}
          onChange={handleChange}
        />
        Instructor
      </label>

      </div>

      {message && <p>{message}</p>}

<div className="btn">
        <button type="submit" className="button1">
         <UserRoundPlus /> Sign Up
        </button>
<Link to="/login" style={{ textDecoration: "none" }}>
        <button type="submit" className="button2">
         <LogIn/> Login
        </button>
</Link>
      </div>
      </form>
    </div>
  );
}