import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription ,CardFooter} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";

const PreferencesPage = () => {
  const [formData, setFormData] = useState({
    age: '',
    location: '',
    occupation: '',
    investmentExperience: '',
    riskTolerance: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send this data to your backend
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
        </CardContent>
        <CardFooter className="flex justify-center mt-6">
          <Button className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-8 py-2 rounded-md font-semibold text-lg" onClick={handleSubmit}>
            Save Preferences
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PreferencesPage;
