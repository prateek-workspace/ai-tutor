"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, Mail, Phone, Calendar, MapPin, 
  Briefcase, BookOpen, Award, Edit, Save
} from "lucide-react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    dob: "January 15, 1995",
    address: "123 Education Ave, Knowledge City, CA 94321",
    occupation: "Student",
    major: "Computer Science",
    courses: "Advanced AI, Web Development, Data Structures",
    achievements: "Dean's List 2023, Hackathon Winner, Research Publication"
  });

  const handleInputChange = (field, value) => {
    setUserData({
      ...userData,
      [field]: value
    });
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and profile information.
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Manage your personal details and preferences.
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={toggleEdit}
              >
                {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-center md:w-1/3">
                  <div className="flex flex-col items-center space-y-3">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="https://i.pravatar.cc/150?u=john.doe" alt="Profile" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        Change Photo
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <Input 
                            id="name" 
                            value={userData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                          />
                        ) : (
                          <span>{userData.name}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <Input 
                            id="email" 
                            value={userData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                          />
                        ) : (
                          <span>{userData.email}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex items-center">
                        <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <Input 
                            id="phone" 
                            value={userData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                          />
                        ) : (
                          <span>{userData.phone}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <Input 
                            id="dob" 
                            value={userData.dob}
                            onChange={(e) => handleInputChange('dob', e.target.value)}
                          />
                        ) : (
                          <span>{userData.dob}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <Input 
                            id="address" 
                            value={userData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                          />
                        ) : (
                          <span>{userData.address}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Educational Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <div className="flex items-center">
                      <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                      {isEditing ? (
                        <Input 
                          id="occupation" 
                          value={userData.occupation}
                          onChange={(e) => handleInputChange('occupation', e.target.value)}
                        />
                      ) : (
                        <span>{userData.occupation}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="major">Major/Field of Study</Label>
                    <div className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                      {isEditing ? (
                        <Input 
                          id="major" 
                          value={userData.major}
                          onChange={(e) => handleInputChange('major', e.target.value)}
                        />
                      ) : (
                        <span>{userData.major}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="courses">Current Courses</Label>
                    <div className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                      {isEditing ? (
                        <Input 
                          id="courses" 
                          value={userData.courses}
                          onChange={(e) => handleInputChange('courses', e.target.value)}
                        />
                      ) : (
                        <span>{userData.courses}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="achievements">Achievements</Label>
                    <div className="flex items-center">
                      <Award className="mr-2 h-4 w-4 text-muted-foreground" />
                      {isEditing ? (
                        <Input 
                          id="achievements" 
                          value={userData.achievements}
                          onChange={(e) => handleInputChange('achievements', e.target.value)}
                        />
                      ) : (
                        <span>{userData.achievements}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              {isEditing && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={toggleEdit}>Cancel</Button>
                  <Button onClick={toggleEdit}>Save Changes</Button>
                </div>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
          <p className="text-muted-foreground">Account settings will be displayed here</p>
        </TabsContent>
        
        <TabsContent value="security" className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
          <p className="text-muted-foreground">Security settings will be displayed here</p>
        </TabsContent>
        
        <TabsContent value="notifications" className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
          <p className="text-muted-foreground">Notification preferences will be displayed here</p>
        </TabsContent>
      </Tabs>
    </div>
  );
} 