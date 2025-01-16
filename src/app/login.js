import { useState } from "react";

export default function SignUp() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      alert("Sign up successful! You can log in now.");
      window.location.href = "/login";
    } else {
      const error = await res.json();
      alert(error.message);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-green-400 to-blue-500">
      <form className="bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
        <h1 className="text-lg font-bold mb-4">Sign Up</h1>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border rounded mb-2"
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-2"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-2"
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Sign Up</button>
      </form>
    </div>
  );
}
