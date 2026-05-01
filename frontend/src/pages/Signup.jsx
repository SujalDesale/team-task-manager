import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (data.msg === "Registered successfully") {
        alert("Account created! Please login.");
        navigate("/");
      } else {
        alert(data.msg || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">

      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-xl shadow-md w-[400px]"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-yellow-700 text-white p-2 rounded-full">✓</div>
          <h2 className="text-xl font-bold">TaskFlow</h2>
        </div>

        <p className="text-sm text-gray-500">SIGN UP</p>

        <h1 className="text-2xl font-bold mb-2">
          Create your account
        </h1>

        <p className="text-gray-500 mb-6">
          Start collaborating with your team in minutes.
        </p>

        {/* NAME */}
        <input
          className="w-full border rounded-lg p-3 mb-4"
          placeholder="Full name"
          onChange={(e) => setName(e.target.value)}
        />

        {/* EMAIL */}
        <input
          className="w-full border rounded-lg p-3 mb-4"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          className="w-full border rounded-lg p-3 mb-6"
          type="password"
          placeholder="Password (min 6 characters)"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-yellow-700 hover:bg-yellow-800 text-white py-3 rounded-lg">
          Create account
        </button>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-yellow-700 font-semibold">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}