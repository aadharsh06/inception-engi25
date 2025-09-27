import React, { useState } from 'react';
import axios from 'axios';


const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.post('/api/user/register', formData, {
        headers: { "Content-Type": "application/json" },
      });

      window.location.href = '/login';

    } catch (err) {
      console.error("Error while sending register data to backend ", err);
      if (err.response) {
        setError(err.response.data.message || 'Registration failed. Please check your details.');
      } else {
        setError('Could not connect to the server. Please try again later.');
      }
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-4 bg-background text-foreground">
      <div className="w-full max-w-md bg-card border shadow-lg rounded-lg">
        <div className="text-center space-y-2 p-6">
          <h1 className="text-4xl font-extrabold">Join Us</h1>
          <p className="text-muted-foreground">
            Create your account to unlock personalized investment insights.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 p-6 pt-0">
            <div className="grid gap-2">
              <label htmlFor="username">Username</label>
              <input id="username" type="text" placeholder="johndoe" required value={formData.username} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"/>
            </div>
            <div className="grid gap-2">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="m@example.com" required value={formData.email} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"/>
            </div>
            <div className="grid gap-2">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" required value={formData.password} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"/>
            </div>
            <div className="grid gap-2">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"/>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-2 p-6 pt-0">
            {error && <p className="text-center text-sm text-red-500">{error}</p>}
            <button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors py-2 rounded-md font-semibold text-lg">
              Register
            </button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/login" className="underline text-primary hover:text-primary/80 transition-colors">
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

