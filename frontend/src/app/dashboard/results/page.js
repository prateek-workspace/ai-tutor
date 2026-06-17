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
import { 
  GraduationCap,
  Medal, 
  Calendar, 
  BookOpen, 
  ChevronRight, 
  Download,
  LineChart,
  BarChart3,
  Clock,
  FileText,
  Check,
  X,
  Star,
  RefreshCw,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ResultsPage() {
  const [selectedSemester, setSelectedSemester] = useState("current");
  
  const semesters = [
    { id: "current", name: "Current Semester (Spring 2023)" },
    { id: "fall2022", name: "Fall 2022" },
    { id: "spring2022", name: "Spring 2022" },
    { id: "fall2021", name: "Fall 2021" },
  ];
  
  const results = {
    current: [
      { 
        id: 1,
        course: "Calculus II",
        code: "MATH 201",
        credits: 4,
        grade: "A",
        percentage: 92,
        status: "completed",
        instructorFeedback: "Excellent work on complex integration problems. Continue focusing on applications."
      },
      { 
        id: 2,
        course: "Organic Chemistry",
        code: "CHEM 310",
        credits: 3,
        grade: "B+",
        percentage: 87,
        status: "completed",
        instructorFeedback: "Good understanding of reaction mechanisms. Work on stereochemistry concepts."
      },
      { 
        id: 3,
        course: "World Literature",
        code: "LIT 105",
        credits: 3,
        grade: "A-",
        percentage: 90,
        status: "completed",
        instructorFeedback: "Thoughtful analysis in essays. Continue developing comparative perspectives."
      },
      { 
        id: 4,
        course: "Physics: Electricity & Magnetism",
        code: "PHYS 202",
        credits: 4,
        grade: "B",
        percentage: 85,
        status: "completed",
        instructorFeedback: "Strong problem-solving skills. Review Maxwell's equations."
      },
      { 
        id: 5,
        course: "Data Structures",
        code: "CS 202",
        credits: 3,
        grade: "A",
        percentage: 94,
        status: "completed",
        instructorFeedback: "Excellent implementation of complex data structures. Very clean and efficient code."
      },
    ],
    fall2022: [
      { 
        id: 6,
        course: "Calculus I",
        code: "MATH 101",
        credits: 4,
        grade: "A-",
        percentage: 91,
        status: "completed",
        instructorFeedback: "Strong grasp of core concepts. Continue practicing applications."
      },
      { 
        id: 7,
        course: "General Chemistry",
        code: "CHEM 101",
        credits: 3,
        grade: "B+",
        percentage: 88,
        status: "completed",
        instructorFeedback: "Good lab work. Review stoichiometry concepts."
      },
      { 
        id: 8,
        course: "Introduction to Literature",
        code: "LIT 101",
        credits: 3,
        grade: "A",
        percentage: 93,
        status: "completed",
        instructorFeedback: "Excellent critical analysis skills. Continue developing your unique voice."
      },
      { 
        id: 9,
        course: "Physics: Mechanics",
        code: "PHYS 101",
        credits: 4,
        grade: "B",
        percentage: 84,
        status: "completed",
        instructorFeedback: "Good understanding of principles. Work on problem-solving efficiency."
      },
      { 
        id: 10,
        course: "Programming Fundamentals",
        code: "CS 101",
        credits: 3,
        grade: "A",
        percentage: 95,
        status: "completed",
        instructorFeedback: "Exceptional programming skills and algorithm understanding."
      },
    ],
    spring2022: [
      { 
        id: 11,
        course: "Pre-Calculus",
        code: "MATH 099",
        credits: 3,
        grade: "A",
        percentage: 94,
        status: "completed",
        instructorFeedback: "Excellent foundation for calculus courses."
      },
      { 
        id: 12,
        course: "Introduction to Chemistry",
        code: "CHEM 099",
        credits: 3,
        grade: "A-",
        percentage: 90,
        status: "completed",
        instructorFeedback: "Strong understanding of basic concepts. Good lab techniques."
      },
      { 
        id: 13,
        course: "Composition and Rhetoric",
        code: "ENG 101",
        credits: 3,
        grade: "B+",
        percentage: 88,
        status: "completed",
        instructorFeedback: "Well-structured essays. Continue working on advanced rhetoric."
      },
      { 
        id: 14,
        course: "Introduction to Computer Science",
        code: "CS 100",
        credits: 3,
        grade: "A",
        percentage: 96,
        status: "completed",
        instructorFeedback: "Outstanding aptitude for programming concepts."
      },
    ]
  };
  
  const currentResults = results[selectedSemester] || [];
  
  const getGradeColor = (grade) => {
    const firstChar = grade.charAt(0);
    switch(firstChar) {
      case 'A': return "text-green-600";
      case 'B': return "text-blue-600";
      case 'C': return "text-yellow-600";
      case 'D': return "text-orange-600";
      case 'F': return "text-red-600";
      default: return "text-muted-foreground";
    }
  };
  
  const calculateGPA = (courses) => {
    if (!courses || courses.length === 0) return 0;
    
    const gradePoints = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0.0
    };
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    courses.forEach(course => {
      totalPoints += gradePoints[course.grade] * course.credits;
      totalCredits += course.credits;
    });
    
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };
  
  const cumulativeGPA = calculateGPA([
    ...results.current,
    ...results.fall2022,
    ...results.spring2022
  ]);
  
  const semesterGPA = calculateGPA(currentResults);
  
  const getTotalCredits = (courses) => {
    return courses.reduce((sum, course) => sum + course.credits, 0);
  };
  
  const getAveragePercentage = (courses) => {
    if (!courses || courses.length === 0) return 0;
    const total = courses.reduce((sum, course) => sum + course.percentage, 0);
    return (total / courses.length).toFixed(1);
  };
  
  const calculateGradeDistribution = (courses) => {
    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    
    courses.forEach(course => {
      const firstChar = course.grade.charAt(0);
      if (distribution[firstChar] !== undefined) {
        distribution[firstChar]++;
      }
    });
    
    return distribution;
  };
  
  const gradeDistribution = calculateGradeDistribution([
    ...results.current,
    ...results.fall2022,
    ...results.spring2022
  ]);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Academic Results</h1>
        <p className="text-muted-foreground">
          View your grades, transcripts, and academic performance.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cumulative GPA
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cumulativeGPA}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>0.12 from last semester</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Semester GPA
            </CardTitle>
            <Medal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{semesterGPA}</div>
            <div className="flex items-center text-xs text-green-600">
              <Star className="h-3 w-3 mr-1" />
              <span>Dean's List Eligible</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Credits Completed
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getTotalCredits([
                ...results.current,
                ...results.fall2022,
                ...results.spring2022
              ])}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of 120 required for graduation
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
            <div className="text-2xl font-bold">
              {getAveragePercentage([
                ...results.current,
                ...results.fall2022,
                ...results.spring2022
              ])}%
            </div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>2.3% from previous semester</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Select Semester</label>
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Semester" />
            </SelectTrigger>
            <SelectContent>
              {semesters.map((semester) => (
                <SelectItem key={semester.id} value={semester.id}>
                  {semester.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download Transcript
        </Button>
      </div>
      
      <Tabs defaultValue="grades" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{semesters.find(s => s.id === selectedSemester)?.name}</CardTitle>
              <CardDescription>
                Grades and credits for the selected semester
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentResults.length > 0 ? (
                    currentResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.course}</TableCell>
                        <TableCell>{result.code}</TableCell>
                        <TableCell>{result.credits}</TableCell>
                        <TableCell className={getGradeColor(result.grade)}>
                          <span className="font-bold">{result.grade}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{result.percentage}%</span>
                            <Progress value={result.percentage} className="h-2 w-16" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge 
                            variant="outline" 
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            {result.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                        No results available for this semester
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableCaption>
                  Semester GPA: {semesterGPA} • Total Credits: {getTotalCredits(currentResults)}
                </TableCaption>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transcript" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Official Transcript</CardTitle>
                  <CardDescription>
                    Your complete academic record
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {semesters.map((semester) => (
                  <div key={semester.id} className="space-y-2">
                    <h3 className="font-semibold flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {semester.name}
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course</TableHead>
                          <TableHead>Code</TableHead>
                          <TableHead>Credits</TableHead>
                          <TableHead>Grade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results[semester.id]?.map((result) => (
                          <TableRow key={result.id}>
                            <TableCell className="font-medium">{result.course}</TableCell>
                            <TableCell>{result.code}</TableCell>
                            <TableCell>{result.credits}</TableCell>
                            <TableCell className={getGradeColor(result.grade)}>
                              {result.grade}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableCaption>
                        Semester GPA: {calculateGPA(results[semester.id] || [])} • 
                        Credits: {getTotalCredits(results[semester.id] || [])}
                      </TableCaption>
                    </Table>
                    <Separator className="my-4" />
                  </div>
                ))}
                
                <div className="p-4 bg-muted/20 rounded-md flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Cumulative Record</h3>
                    <p className="text-sm text-muted-foreground">All semesters combined</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">GPA: {cumulativeGPA}</div>
                    <p className="text-sm text-muted-foreground">
                      Total Credits: {getTotalCredits([
                        ...results.current,
                        ...results.fall2022,
                        ...results.spring2022
                      ])}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>
                  Breakdown of your grades across all courses
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="flex flex-col h-full justify-center">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-sm font-medium">A Grades</span>
                        </div>
                        <span className="text-sm font-medium">{gradeDistribution.A}</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500" 
                          style={{ 
                            width: `${(gradeDistribution.A / Object.values(gradeDistribution).reduce((a, b) => a + b, 0)) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                          <span className="text-sm font-medium">B Grades</span>
                        </div>
                        <span className="text-sm font-medium">{gradeDistribution.B}</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500" 
                          style={{ 
                            width: `${(gradeDistribution.B / Object.values(gradeDistribution).reduce((a, b) => a + b, 0)) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                          <span className="text-sm font-medium">C Grades</span>
                        </div>
                        <span className="text-sm font-medium">{gradeDistribution.C}</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-500" 
                          style={{ 
                            width: `${(gradeDistribution.C / Object.values(gradeDistribution).reduce((a, b) => a + b, 0)) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                          <span className="text-sm font-medium">D Grades</span>
                        </div>
                        <span className="text-sm font-medium">{gradeDistribution.D}</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-orange-500" 
                          style={{ 
                            width: `${(gradeDistribution.D / Object.values(gradeDistribution).reduce((a, b) => a + b, 0)) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                          <span className="text-sm font-medium">F Grades</span>
                        </div>
                        <span className="text-sm font-medium">{gradeDistribution.F}</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500" 
                          style={{ 
                            width: `${(gradeDistribution.F / Object.values(gradeDistribution).reduce((a, b) => a + b, 0)) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>GPA Trend</CardTitle>
                <CardDescription>
                  Your GPA progression by semester
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex flex-col justify-between">
                <div className="flex justify-between w-full border-b border-border pb-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-16 bg-primary rounded-t-sm" style={{ height: `${calculateGPA(results.spring2022) * 30}px` }}></div>
                    <span className="text-xs">Spring 2022</span>
                    <span className="text-xs font-medium">{calculateGPA(results.spring2022)}</span>
                  </div>
                  
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-16 bg-primary rounded-t-sm" style={{ height: `${calculateGPA(results.fall2022) * 30}px` }}></div>
                    <span className="text-xs">Fall 2022</span>
                    <span className="text-xs font-medium">{calculateGPA(results.fall2022)}</span>
                  </div>
                  
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-16 bg-primary rounded-t-sm" style={{ height: `${calculateGPA(results.current) * 30}px` }}></div>
                    <span className="text-xs">Spring 2023</span>
                    <span className="text-xs font-medium">{calculateGPA(results.current)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 mt-4">
                  <div className="flex items-center">
                    <LineChart className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm font-medium">Trend: Increasing</span>
                  </div>
                  
                  <div className="flex items-center text-green-600">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">
                      {(calculateGPA(results.current) - calculateGPA(results.fall2022)).toFixed(2)} from previous
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Academic Requirements</CardTitle>
              <CardDescription>
                Track your progress toward degree requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium">Core Requirements</h4>
                    <span className="text-sm">75% Complete</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium">Major Requirements</h4>
                    <span className="text-sm">60% Complete</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium">Electives</h4>
                    <span className="text-sm">40% Complete</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium">Overall Completion</h4>
                    <span className="text-sm">58% Complete</span>
                  </div>
                  <Progress value={58} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Instructor Feedback</CardTitle>
              <CardDescription>
                Comments and feedback from your instructors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {currentResults.map((result) => (
                  <div key={result.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{result.course}</h3>
                        <p className="text-sm text-muted-foreground">{result.code}</p>
                      </div>
                      <Badge variant="outline" className={getGradeColor(result.grade)}>
                        {result.grade} ({result.percentage}%)
                      </Badge>
                    </div>
                    
                    <div className="pl-4 border-l-2 border-primary/50 italic text-sm">
                      "{result.instructorFeedback}"
                    </div>
                    
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Instructor: {result.id % 2 === 0 ? "Dr. Smith" : "Prof. Johnson"}</span>
                      <span>Last Updated: {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Academic Standing</CardTitle>
          <CardDescription>
            Your current status and accomplishments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-4">
              <div className="bg-green-100 p-2 rounded-full">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-green-800">Good Academic Standing</h3>
                <p className="text-sm text-green-700 mt-1">
                  You are currently in good academic standing with the university.
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <Medal className="h-5 w-5 text-blue-600" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-blue-800">Dean's List Eligible</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Your current semester GPA qualifies you for the Dean's List recognition.
                </p>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium">On Track for Graduation</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on your current progress, you are on track to graduate by Spring 2025.
                </p>
                <div className="mt-2">
                  <Progress value={58} className="h-2" />
                  <div className="flex justify-between text-xs mt-1">
                    <span>58% Complete</span>
                    <span>Estimated completion: Spring 2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <FileText className="mr-2 h-4 w-4" />
            Request Academic Evaluation
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 