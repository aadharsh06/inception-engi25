import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-4 bg-background text-foreground">
      <Card className="w-full max-w-md bg-card border shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-4xl font-extrabold">Join Us</CardTitle>
          <CardDescription className="text-muted-foreground">
            Create your account to unlock personalized investment insights.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" type="text" placeholder="johndoe" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input id="confirm-password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 mt-6">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors py-2 rounded-md font-semibold text-lg">
            Register
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="underline text-primary hover:text-primary/80 transition-colors">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
