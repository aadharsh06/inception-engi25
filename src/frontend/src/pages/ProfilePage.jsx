import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import Cookies from 'js-cookie'; // Import Cookies

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // State to hold user data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmailFromCookie, setUserEmailFromCookie] = useState(null); // State to hold email from cookie

  useEffect(() => {
    const emailFromCookie = Cookies.get('userEmail');
    if (emailFromCookie) {
      setUserEmailFromCookie(emailFromCookie);
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/user/get-user', { withCredentials: true });
        console.log(response.data);
        setUser(response.data.data); 
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to load user data.");
        navigate('/login'); // Redirect to login if fetching fails (e.g., not authenticated)
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]); // Add navigate to dependency array

  const handleClick = () => {
    navigate('/home');
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-background text-foreground p-4">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-background text-foreground p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-background text-foreground p-4">
        <p>User data not available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="flex flex-col items-center space-y-8">
        {/* Circular Avatar */}
        <Avatar className="h-32 w-32 border-4 border-primary shadow-lg">
          <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${user?.username || 'U'}`} alt={user.username || 'User Avatar'} />
          <AvatarFallback className="text-5xl font-bold">{user?.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>

        {/* User Info Card */}
        <Card className="w-full max-w-lg bg-card border shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">{user.username}</CardTitle>
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
            <div className="grid gap-2 text-center">
              <Label className="text-lg font-semibold">Age:</Label>
              <p className="text-muted-foreground text-base">{user.age}</p>
            </div>
            <div className="grid gap-2 text-center">
              <Label className="text-lg font-semibold">Occupation:</Label>
              <p className="text-muted-foreground text-base">{user.occupation}</p>
            </div>
            <div className="grid gap-2 text-center">
              <Label className="text-lg font-semibold">Investment Experience:</Label>
              <p className="text-muted-foreground text-base">{user.investment_experience}</p>
            </div>
            {/* Add more user details here as needed */}
          </CardContent>
          <div className="p-6 pt-0 flex justify-center">
         
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
