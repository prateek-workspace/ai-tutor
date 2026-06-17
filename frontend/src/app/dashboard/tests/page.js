"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Timer, 
  FileText, 
  BarChart3,
  BookMarked,
  PenLine,
  LucideCalculator,
  GraduationCap,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TestsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tests, setTests] = useState([
    {
      id: 1,
      title: "Calculus Midterm",
      subject: "Mathematics",
      date: "2023-06-15",
      time: "10:00 AM - 12:00 PM",
      status: "upcoming",
      type: "exam",
      location: "Room 101",
      chapters: ["Limits", "Derivatives", "Integrals"],
      instructor: "Prof. Johnson",
      totalMarks: 100,
      duration: "2 hours"
    },
    {
      id: 2,
      title: "Chemical Equilibrium Quiz",
      subject: "Chemistry",
      date: "2023-06-12",
      time: "09:00 AM - 09:45 AM",
      status: "upcoming",
      type: "quiz",
      location: "Room 203",
      chapters: ["Chemical Equilibrium", "Le Chatelier's Principle"],
      instructor: "Dr. Smith",
      totalMarks: 30,
      duration: "45 minutes"
    },
    {
      id: 3,
      title: "Literary Analysis Test",
      subject: "Literature",
      date: "2023-06-05",
      time: "01:00 PM - 02:30 PM",
      status: "completed",
      type: "test",
      location: "Room 305",
      chapters: ["Poetry Analysis", "Character Development", "Narrative Structures"],
      instructor: "Ms. Garcia",
      totalMarks: 50,
      duration: "1.5 hours",
      score: 42,
      percentage: 84
    },
    {
      id: 4,
      title: "Physics Final Exam",
      subject: "Physics",
      date: "2023-06-25",
      time: "09:00 AM - 12:00 PM",
      status: "upcoming",
      type: "exam",
      location: "Hall A",
      chapters: ["Mechanics", "Waves", "Thermodynamics", "Electricity", "Magnetism"],
      instructor: "Dr. Williams",
      totalMarks: 100,
      duration: "3 hours"
    },
    {
      id: 5,
      title: "Data Structures Quiz",
      subject: "Computer Science",
      date: "2023-05-28",
      time: "11:00 AM - 11:45 AM",
      status: "completed",
      type: "quiz",
      location: "Lab 102",
      chapters: ["Trees", "Graphs", "Sorting Algorithms"],
      instructor: "Mr. Lee",
      totalMarks: 25,
      duration: "45 minutes",
      score: 23,
      percentage: 92
    },
    {
      id: 6,
      title: "Organic Chemistry Test",
      subject: "Chemistry",
      date: "2023-05-20",
      time: "10:00 AM - 11:30 AM",
      status: "completed",
      type: "test",
      location: "Room 203",
      chapters: ["Functional Groups", "Reaction Mechanisms"],
      instructor: "Dr. Smith",
      totalMarks: 50,
      duration: "1.5 hours",
      score: 38,
      percentage: 76
    }
  ]);

  const filteredTests = tests.filter(test => 
    test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingTests = filteredTests.filter(test => test.status === "upcoming");
  const completedTests = filteredTests.filter(test => test.status === "completed");

  const getStatusBadge = (status) => {
    switch(status) {
      case "upcoming":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Upcoming</Badge>;
      case "completed":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case "missed":
        return <Badge variant="destructive">Missed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTestIcon = (type) => {
    switch(type) {
      case "exam":
        return <GraduationCap className="h-5 w-5 text-primary" />;
      case "quiz":
        return <PenLine className="h-5 w-5 text-indigo-600" />;
      case "test":
        return <FileText className="h-5 w-5 text-amber-600" />;
      default:
        return <BookOpen className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPerformanceBadge = (percentage) => {
    if (percentage >= 90) {
      return <Badge className="bg-green-50 text-green-700 border-green-200">Excellent</Badge>;
    } else if (percentage >= 80) {
      return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Good</Badge>;
    } else if (percentage >= 70) {
      return <Badge className="bg-amber-50 text-amber-700 border-amber-200">Satisfactory</Badge>;
    } else {
      return <Badge className="bg-red-50 text-red-700 border-red-200">Needs Improvement</Badge>;
    }
  };

  const averageScore = completedTests.reduce((sum, test) => sum + test.percentage, 0) / 
    (completedTests.length || 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tests & Quizzes</h1>
        <p className="text-muted-foreground">
          Manage your exams, tests, and quizzes in one place.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by title, subject, or instructor"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            <SelectItem value="mathematics">Mathematics</SelectItem>
            <SelectItem value="physics">Physics</SelectItem>
            <SelectItem value="chemistry">Chemistry</SelectItem>
            <SelectItem value="literature">Literature</SelectItem>
            <SelectItem value="computerscience">Computer Science</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Tests
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingTests.length}</div>
            <p className="text-xs text-muted-foreground">
              Next: {upcomingTests.length > 0 ? upcomingTests[0].title : "None scheduled"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tests Completed
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTests.length}</div>
            <p className="text-xs text-muted-foreground">
              This semester so far
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Score
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all completed tests
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Study Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28.5h</div>
            <p className="text-xs text-muted-foreground">
              Dedicated to test preparation
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All Tests</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingTests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingTests.map((test) => (
                <Card key={test.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{test.title}</CardTitle>
                        <CardDescription>
                          {test.subject} • {test.type.charAt(0).toUpperCase() + test.type.slice(1)}
                        </CardDescription>
                      </div>
                      {getStatusBadge(test.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{test.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{test.time} ({test.duration})</span>
                      </div>
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">Location: {test.location}</span>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Topics Covered:</h4>
                        <div className="flex flex-wrap gap-2">
                          {test.chapters.map((chapter, index) => (
                            <Badge key={index} variant="outline">{chapter}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-between">
                    <div className="text-sm text-muted-foreground">
                      {test.instructor}
                    </div>
                    <Button variant="outline" size="sm">
                      Prepare
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-[200px]">
                <CheckCircle2 className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No upcoming tests at the moment.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {completedTests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedTests.map((test) => (
                <Card key={test.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{test.title}</CardTitle>
                        <CardDescription>
                          {test.subject} • {test.type.charAt(0).toUpperCase() + test.type.slice(1)}
                        </CardDescription>
                      </div>
                      {getStatusBadge(test.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Score</p>
                          <div className="text-2xl font-bold">{test.score}/{test.totalMarks}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{test.percentage}%</div>
                          <div>{getPerformanceBadge(test.percentage)}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Your performance</span>
                          <span className="font-medium">{test.percentage}%</span>
                        </div>
                        <Progress value={test.percentage} className="h-2" />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{test.date}</span>
                      </div>
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">Location: {test.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-between">
                    <div className="text-sm text-muted-foreground">
                      {test.instructor}
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-[200px]">
                <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No completed tests yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Tests</CardTitle>
              <CardDescription>
                Overview of all your tests and quizzes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTests.map((test) => (
                  <div key={test.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary/10 rounded-full p-3">
                      {getTestIcon(test.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{test.title}</h3>
                          <p className="text-sm text-muted-foreground">{test.subject}</p>
                        </div>
                        <div>
                          {getStatusBadge(test.status)}
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-2 gap-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-xs">{test.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Timer className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-xs">{test.duration}</span>
                        </div>
                      </div>
                      
                      {test.status === "completed" && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Score: </span>
                          <span>{test.score}/{test.totalMarks} ({test.percentage}%)</span>
                        </div>
                      )}
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      {test.status === "upcoming" ? "Prepare" : "View"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analysis</CardTitle>
              <CardDescription>
                Review your test performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">Performance analytics will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Study Resources</CardTitle>
          <CardDescription>
            Helpful materials for your upcoming tests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="bg-primary/10 rounded-full p-3">
                <BookMarked className="h-5 w-5 text-primary" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium">Calculus Practice Problems</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  A collection of problems to help you prepare for the Calculus Midterm.
                </p>
                <div className="flex items-center mt-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-xs text-muted-foreground">50 practice problems with solutions</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                Access
              </Button>
            </div>
            
            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="bg-primary/10 rounded-full p-3">
                <PenLine className="h-5 w-5 text-primary" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium">Chemical Equilibrium Study Guide</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Key concepts and formulas for the Chemical Equilibrium Quiz.
                </p>
                <div className="flex items-center mt-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-xs text-muted-foreground">Comprehensive study guide with examples</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                Access
              </Button>
            </div>
            
            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="bg-primary/10 rounded-full p-3">
                <LucideCalculator className="h-5 w-5 text-primary" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium">Physics Formula Sheet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  All the formulas you'll need for the Physics Final Exam.
                </p>
                <div className="flex items-center mt-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-xs text-muted-foreground">Organized by topic with application notes</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                Access
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">View All Resources</Button>
        </CardFooter>
      </Card>
    </div>
  );
} 