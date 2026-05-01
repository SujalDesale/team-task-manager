import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import bgImage from "../assets/Signup.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Login failed");
        return;
      }

      if (data.token) {
        // ✅ store token
        localStorage.setItem("token", data.token);

        // ✅ store user
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/dashboard");
      } else {
        alert("Invalid credentials");
      }

    } catch (err) {
      console.error("Login error:", err);
      alert("Server not reachable 🚨");
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

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex flex-col justify-end p-12 text-white">
          <h2 className="text-lg font-semibold mb-3">✔ TaskFlow</h2>

          <h1 className="text-4xl font-bold mb-4">
            Where focused teams ship work that matters.
          </h1>

          <p className="text-sm text-gray-200 max-w-md">
            Plan projects, assign tasks, track progress and keep everyone aligned.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-white">
        <form onSubmit={handleLogin} className="w-[380px] p-6">

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
            className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-yellow-600"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg p-3 mb-6 focus:ring-2 focus:ring-yellow-600"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* BUTTON */}
          <button className="w-full bg-yellow-700 text-white py-3 rounded-lg hover:bg-yellow-800 transition">
            Sign in
          </button>

          {/* SIGNUP */}
          <p className="text-sm text-gray-500 mt-4">
            New to TaskFlow?{" "}
            <Link to="/signup" className="text-yellow-700 font-semibold">
              Create an account
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}