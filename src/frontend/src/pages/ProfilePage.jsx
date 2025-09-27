import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  // Placeholder user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    location: "New York, USA",
    avatarUrl: "https://github.com/shadcn.png",
  };
  const navigate=useNavigate();
  const handleClick=()=> {
   navigate('/home');
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="flex flex-col items-center space-y-8">
        {/* Circular Avatar */}
        <Avatar className="h-32 w-32 border-4 border-primary shadow-lg">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback className="text-5xl font-bold">JD</AvatarFallback>
        </Avatar>

        {/* User Info Card */}
        <Card className="w-full max-w-lg bg-card border shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">{user.name}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2 text-center">
              <Label className="text-lg font-semibold">Email:</Label>
              <p className="text-muted-foreground text-base">{user.email}</p>
            </div>
            <div className="grid gap-2 text-center">
              <Label className="text-lg font-semibold">Location:</Label>
              <p className="text-muted-foreground text-base">{user.location}</p>
            </div>
            {/* Add more user details here as needed */}
          </CardContent>
          <div className="p-6 pt-0 flex justify-center">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-6 py-2 rounded-md font-semibold">
              Edit Profile
            </Button>
            <Button className=" ml-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-6 py-2 rounded-md font-semibold" onClick={handleClick}>
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
