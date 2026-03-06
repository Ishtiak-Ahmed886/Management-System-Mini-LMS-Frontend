import { User,Lock, LogIn, UserRoundPlus, AtSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div style={{
      height: "100vh",
      display:"flex",
      justifyContent: "center",
      alignItems: "center"}}>

      <form className="form">
      <h2 id="heading">Register</h2>
        <div className="field">
       <User/>
        <input
          placeholder="Username"
          className="input-field"
          type="text"
        />
      </div>

<div className="field">

       <AtSign />

        <input
          placeholder="Email"
          className="input-field"
          type="email"
        />

      </div>

<div className="field">

       <Lock />

        <input
          placeholder="Password"
          className="input-field"
          type="password"
        />

      </div>
        
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