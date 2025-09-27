import React, { useState } from 'react';
import axios from 'axios';

const Card = ({ children, className = '' }) => (<div className={className}>{children}</div>);
const CardHeader = ({ children, className = '' }) => (<div className={className}>{children}</div>);
const CardTitle = ({ children, className = '' }) => (<h1 className={className}>{children}</h1>);
const CardDescription = ({ children, className = '' }) => (<p className={className}>{children}</p>);
const CardContent = ({ children, className = '' }) => (<div className={className}>{children}</div>);
const CardFooter = ({ children, className = '' }) => (<div className={className}>{children}</div>);
const Label = ({ children, ...props }) => (<label {...props}>{children}</label>);
const Input = (props) => (<input className="w-full p-2 border rounded-md bg-transparent" {...props} />);
const Button = ({ children, ...props }) => (<button {...props}>{children}</button>);


const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`/api/user/login`, {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200) {
        console.log("Login successful:", response.data);
        window.location.href = '/home';
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-4 bg-background text-foreground">
      <Card className="w-full max-w-md bg-card border shadow-lg rounded-lg">
        <CardHeader className="text-center space-y-2 p-6">
          <CardTitle className="text-4xl font-extrabold">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Log in to your account to continue.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
            <CardContent className="grid gap-6 px-6">
                {error && <div className="p-3 bg-red-500/10 text-red-500 rounded-md text-center text-sm border border-red-500/20">{error}</div>}
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" required value={formData.email} onChange={handleChange} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required value={formData.password} onChange={handleChange} />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 p-6">
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors py-2 rounded-md font-semibold text-lg">
                    Login
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <a href="/register" className="underline text-primary hover:text-primary/80 transition-colors">
                    Register
                    </a>
                </p>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;

