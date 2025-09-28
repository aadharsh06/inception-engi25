import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import Cookies from 'js-cookie'; // Import Cookies
import { Card, CardContent, CardHeader, CardTitle, CardDescription ,CardFooter} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { v4 as uuidv4 } from 'uuid'; // Import uuid

const PreferencesPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [formData, setFormData] = useState({
    age: '',
    location: '',
    occupation: '',
    investmentExperience: '',
    riskTolerance: '',
    goal_type: '',
    target_amount: '',
    target_years: '',
    volatility_tolerance: '',
    preferred_sectors: '',
    excluded_sectors: '',
    initial_investment: '',
    liquidity_needs_percentage: '',
    portfolioStyle: '',
    
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSelectChange = (id, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => { // Mark as async
    e.preventDefault();
    const userEmail = Cookies.get('userEmail'); // Get email from cookie

    if (!userEmail) {
      alert("User email not found in cookies. Please log in again.");
      navigate('/login'); // Redirect to login
      return;
    }

    const dataToSend = { 
      email: userEmail,
      investmentPrefs: {
        age: formData.age, 
        location: formData.location, 
        occupation: formData.occupation, 
        investment_experience: formData.investmentExperience.toUpperCase(),
        goal_type: formData.goal_type.toUpperCase(),
        target_amount: parseFloat(formData.target_amount),
        target_years: parseInt(formData.target_years),
        risk_tolerance: formData.riskTolerance.toUpperCase(),
        volatility_tolerance: formData.volatility_tolerance.toUpperCase(),
        preferred_sectors: formData.preferred_sectors ? formData.preferred_sectors.split(',').map(s => s.trim()) : [],
        excluded_sectors: formData.excluded_sectors ? formData.excluded_sectors.split(',').map(s => s.trim()) : [],
        initial_investment: parseFloat(formData.initial_investment),
        liquidity_needs_percentage: parseFloat(formData.liquidity_needs_percentage),
        portfolioStyle: formData.portfolioStyle,
      
 
      },
    };
    console.log("Form submitted:", dataToSend);

    try {
      const res = await axios.patch('/api/user/update-user-details', dataToSend, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log("Preferences updated successfully:", res.data);
      alert("Preferences saved successfully!");
      
     
      navigate('/home'); // Redirect to profile or home page
    } catch (error) {
      console.error("Error while sending preferences data to backend:", error);
      alert("Failed to save preferences. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-background text-foreground p-4">
      <Card className="w-full max-w-2xl bg-card border shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-4xl font-extrabold">Your Preferences</CardTitle>
          <CardDescription className="text-muted-foreground text-lg">
            Help us tailor your investment experience.
          </CardDescription>
        </CardHeader>
        <form  onSubmit={handleSubmit} className="flex flex-col w-full">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-2">
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" placeholder="30" value={formData.age} onChange={handleChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" type="text" placeholder="New York, USA" value={formData.location} onChange={handleChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="occupation">Occupation</Label>
            <Input id="occupation" type="text" placeholder="Software Engineer" value={formData.occupation} onChange={handleChange} required />
          </div>
          <div className="grid gap-2">
             <Label htmlFor="investmentExperience">Investment Experience</Label>
             <Select onValueChange={(value) => handleSelectChange('investmentExperience', value)} value={formData.investmentExperience} id="investmentExperience">
              <SelectTrigger className="bg-white text-black">
                <SelectValue placeholder="Select your experience" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                <SelectItem value="experienced">Experienced (5+ years)</SelectItem>
              </SelectContent>
            </Select>

          </div>
          <div className="grid gap-2 col-span-full">
            <Label htmlFor="riskTolerance">Risk Tolerance</Label>
            <Select onValueChange={(value) => handleSelectChange('riskTolerance', value)} value={formData.riskTolerance} id="riskTolerance">
              <SelectTrigger>
                <SelectValue placeholder="Select your risk tolerance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="goal_type">Goal Type</Label>
            <Select onValueChange={(value) => handleSelectChange('goal_type', value)} value={formData.goal_type} id="goal_type">
              <SelectTrigger>
                <SelectValue placeholder="Select your goal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RETIREMENT">Retirement</SelectItem>
                <SelectItem value="LONG_TERM">Long Term</SelectItem>
                <SelectItem value="SHORT_TERM">Short Term</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="target_amount">Target Amount</Label>
            <Input id="target_amount" type="number" placeholder="1000000" value={formData.target_amount} onChange={handleChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="target_years">Target Years</Label>
            <Input id="target_years" type="number" placeholder="10" value={formData.target_years} onChange={handleChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="volatility_tolerance">Volatility Tolerance</Label>
            <Select onValueChange={(value) => handleSelectChange('volatility_tolerance', value)} value={formData.volatility_tolerance} id="volatility_tolerance">
              <SelectTrigger>
                <SelectValue placeholder="Select your volatility tolerance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="preferred_sectors">Preferred Sectors (comma-separated)</Label>
            <Input id="preferred_sectors" type="text" placeholder="Technology, Healthcare" value={formData.preferred_sectors} onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="excluded_sectors">Excluded Sectors (comma-separated)</Label>
            <Input id="excluded_sectors" type="text" placeholder="Tobacco, Gambling" value={formData.excluded_sectors} onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="initial_investment">Initial Investment</Label>
            <Input id="initial_investment" type="number" placeholder="10000" value={formData.initial_investment} onChange={handleChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="liquidity_needs_percentage">Liquidity Needs Percentage</Label>
            <Input id="liquidity_needs_percentage" type="number" placeholder="20" value={formData.liquidity_needs_percentage} onChange={handleChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="portfolioStyle">Portfolio Style</Label>
            <Input id="portfolioStyle" type="text" placeholder="e.g., Aggressive Growth" value={formData.portfolioStyle} onChange={handleChange} />
          </div>
          
        </CardContent>
        <CardFooter className="flex justify-center mt-6">
          <Button  type="submit" className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-8 py-2 rounded-md font-semibold text-lg" >
            Save Preferences
          </Button>
        </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default PreferencesPage;
