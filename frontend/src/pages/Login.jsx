import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import bgImage from "../assets/Signup.jpg"; // ✅ IMPORTANT FIX

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email && password) {
      localStorage.setItem("user", JSON.stringify({ email }));
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex h-screen">

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 relative">
        
        <img
          src={bgImage}
          alt="background"
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex flex-col justify-end p-12 text-white">

          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            ✔ TaskFlow
          </h2>

          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Where focused teams ship work that matters.
          </h1>

          <p className="text-sm text-gray-200 max-w-md">
            Plan projects, assign tasks, track progress and keep everyone aligned — without the noise.
          </p>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-white">
        
        <form
          onSubmit={handleLogin}
          className="w-[380px] p-6"
        >
          <p className="text-sm text-gray-400 mb-2 tracking-widest">
            SIGN IN
          </p>

          <h2 className="text-3xl font-bold mb-2">
            Welcome back
          </h2>

          <p className="text-gray-500 mb-6">
            Sign in to your team workspace to continue.
          </p>

          {/* EMAIL */}
          <input
            type="email"
            className="w-full border border-gray-300 bg-white text-black rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-600"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <input
            type="password"
            className="w-full border border-gray-300 bg-white text-black rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-yellow-600"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* BUTTON */}
          <button className="w-full bg-yellow-700 hover:bg-yellow-800 transition-all duration-200 text-white py-3 rounded-lg shadow-md">
            Sign in
          </button>

          {/* SIGNUP LINK */}
          <p className="text-sm text-gray-500 mt-4">
            New to TaskFlow?{" "}
            <Link to="/signup" className="text-yellow-700 font-semibold">
              Create an account
            </Link>
          </p>

          {/* DEMO BOX */}
          <div className="bg-gray-100 text-sm p-3 rounded mt-4 text-gray-600">
            Demo credentials – admin@taskflow.com / Admin@12345
          </div>

        </form>
      </div>
    </div>
  );
}