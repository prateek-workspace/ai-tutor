"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  CheckCheck, 
  X, 
  Clock, 
  CalendarDays, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Percent, 
  AlertCircle, 
  BookOpen 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AttendancePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  
  const subjects = [
    {
      id: 1,
      name: "Mathematics",
      present: 18,
      absent: 2,
      total: 20,
      percentage: 90,
      color: "blue"
    },
    {
      id: 2,
      name: "Physics",
      present: 17,
      absent: 3,
      total: 20,
      percentage: 85,
      color: "green"
    },
    {
      id: 3,
      name: "Chemistry",
      present: 19,
      absent: 1,
      total: 20,
      percentage: 95,
      color: "amber"
    },
    {
      id: 4,
      name: "Literature",
      present: 16,
      absent: 4,
      total: 20,
      percentage: 80,
      color: "violet"
    },
    {
      id: 5,
      name: "Computer Science",
      present: 20,
      absent: 0,
      total: 20,
      percentage: 100,
      color: "cyan"
    }
  ];
  
  const attendanceRecords = [
    {
      id: 1,
      date: "2023-06-01",
      subject: "Mathematics",
      status: "present",
      time: "09:00 AM - 10:30 AM",
      instructor: "Prof. Johnson"
    },
    {
      id: 2,
      date: "2023-06-01",
      subject: "Physics",
      status: "present",
      time: "11:00 AM - 12:30 PM",
      instructor: "Dr. Williams"
    },
    {
      id: 3,
      date: "2023-06-02",
      subject: "Chemistry",
      status: "present",
      time: "09:00 AM - 10:30 AM",
      instructor: "Dr. Smith"
    },
    {
      id: 4,
      date: "2023-06-02",
      subject: "Literature",
      status: "absent",
      time: "11:00 AM - 12:30 PM",
      instructor: "Ms. Garcia"
    },
    {
      id: 5,
      date: "2023-06-03",
      subject: "Computer Science",
      status: "present",
      time: "09:00 AM - 10:30 AM",
      instructor: "Mr. Lee"
    },
    {
      id: 6,
      date: "2023-06-03",
      subject: "Mathematics",
      status: "present",
      time: "11:00 AM - 12:30 PM",
      instructor: "Prof. Johnson"
    },
    {
      id: 7,
      date: "2023-06-04",
      subject: "Physics",
      status: "present",
      time: "09:00 AM - 10:30 AM",
      instructor: "Dr. Williams"
    },
    {
      id: 8,
      date: "2023-06-04",
      subject: "Chemistry",
      status: "present",
      time: "11:00 AM - 12:30 PM",
      instructor: "Dr. Smith"
    },
    {
      id: 9,
      date: "2023-06-05",
      subject: "Literature",
      status: "absent",
      time: "09:00 AM - 10:30 AM",
      instructor: "Ms. Garcia"
    },
    {
      id: 10,
      date: "2023-06-05",
      subject: "Computer Science",
      status: "present",
      time: "11:00 AM - 12:30 PM",
      instructor: "Mr. Lee"
    }
  ];
  
  const getStatusBadge = (status) => {
    switch(status) {
      case "present":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Present</Badge>;
      case "absent":
        return <Badge variant="destructive">Absent</Badge>;
      case "late":
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200">Late</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getSubjectPercentageColor = (percentage) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-amber-600";
    return "text-red-600";
  };
  
  // Calendar rendering logic
  const renderCalendar = () => {
    const monthStart = new Date(selectedYear, selectedMonth, 1);
    const monthEnd = new Date(selectedYear, selectedMonth + 1, 0);
    const startDate = new Date(monthStart);
    const endDate = new Date(monthEnd);
    
    // Adjust to start from Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    // Adjust to end on Saturday
    if (endDate.getDay() < 6) {
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    }
    
    const rows = [];
    let days = [];
    let day = new Date(startDate);
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = day.toISOString().split('T')[0];
        const hasAttendance = attendanceRecords.some(record => record.date === formattedDate);
        const isAbsent = attendanceRecords.some(record => record.date === formattedDate && record.status === "absent");
        const isCurrentMonth = day.getMonth() === selectedMonth;
        
        days.push(
          <div 
            key={day.toISOString()} 
            className={`
              h-14 p-2 border border-border rounded-md relative
              ${isCurrentMonth ? 'bg-background' : 'bg-muted/30 text-muted-foreground'}
              ${day.toDateString() === new Date().toDateString() ? 'ring-2 ring-primary ring-offset-1' : ''}
            `}
          >
            <span className="text-sm font-medium">{day.getDate()}</span>
            {hasAttendance && (
              <div className="absolute bottom-2 right-2">
                {isAbsent ? (
                  <X className="h-4 w-4 text-destructive" />
                ) : (
                  <CheckCheck className="h-4 w-4 text-green-600" />
                )}
              </div>
            )}
          </div>
        );
        
        const newDate = new Date(day);
        newDate.setDate(newDate.getDate() + 1);
        day = newDate;
      }
      
      rows.push(
        <div key={day.toISOString()} className="grid grid-cols-7 gap-2">
          {days}
        </div>
      );
      
      days = [];
    }
    
    return rows;
  };
  
  const goToPreviousMonth = () => {
    const newDate = new Date(selectedYear, selectedMonth - 1, 1);
    setSelectedMonth(newDate.getMonth());
    setSelectedYear(newDate.getFullYear());
  };
  
  const goToNextMonth = () => {
    const newDate = new Date(selectedYear, selectedMonth + 1, 1);
    setSelectedMonth(newDate.getMonth());
    setSelectedYear(newDate.getFullYear());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
        <p className="text-muted-foreground">
          Track and manage your class attendance records.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Attendance
            </CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">90%</div>
            <p className="text-xs text-muted-foreground">
              90 of 100 classes attended
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Present Count
            </CardTitle>
            <CheckCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">90</div>
            <p className="text-xs text-green-600">
              +5 from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Absent Count
            </CardTitle>
            <X className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10</div>
            <p className="text-xs text-destructive">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Attendance Streak
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 days</div>
            <p className="text-xs text-muted-foreground">
              Keep up the good work!
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="records" className="space-y-4">
        <TabsList>
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Attendance Records</CardTitle>
                  <CardDescription>
                    Your complete attendance history
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
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
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.date}</TableCell>
                      <TableCell>{record.subject}</TableCell>
                      <TableCell>{record.time}</TableCell>
                      <TableCell>{record.instructor}</TableCell>
                      <TableCell>
                        {getStatusBadge(record.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={goToPreviousMonth}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle>
                    {MONTHS[selectedMonth]} {selectedYear}
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={goToNextMonth}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedMonth(currentDate.getMonth());
                    setSelectedYear(currentDate.getFullYear());
                  }}
                >
                  Today
                </Button>
              </div>
              <CardDescription>
                View your attendance on the calendar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-2">
                {DAYS.map(day => (
                  <div key={day} className="text-center text-sm font-medium py-1">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                {renderCalendar()}
              </div>
              
              <div className="flex items-center justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <CheckCheck className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4 text-destructive" />
                  <span className="text-sm">Absent</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subjects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Attendance</CardTitle>
              <CardDescription>
                Your attendance breakdown by subject
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {subjects.map((subject) => (
                  <div key={subject.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{subject.name}</span>
                      </div>
                      <span className={`text-sm font-medium ${getSubjectPercentageColor(subject.percentage)}`}>
                        {subject.percentage}%
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mb-2">
                      <span>Present: {subject.present}</span>
                      <span className="mx-2">•</span>
                      <span>Absent: {subject.absent}</span>
                      <span className="mx-2">•</span>
                      <span>Total: {subject.total}</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className={`h-full bg-${subject.color}-600`} style={{ width: `${subject.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Analytics</CardTitle>
              <CardDescription>
                Insights into your attendance patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Attendance analytics will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Upcoming Classes</CardTitle>
              <CardDescription>
                Make sure to attend these classes
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 border rounded-md">
              <div className="bg-primary/10 rounded-full p-3">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium">Mathematics Lecture</h3>
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-sm text-muted-foreground">Tomorrow, 9:00 AM - 10:30 AM</span>
                </div>
                <div className="flex items-center mt-1">
                  <Users className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-sm text-muted-foreground">Prof. Johnson</span>
                </div>
              </div>
              
              <Badge>Required</Badge>
            </div>
            
            <div className="flex items-start gap-4 p-4 border rounded-md">
              <div className="bg-primary/10 rounded-full p-3">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium">Physics Lab</h3>
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-sm text-muted-foreground">Tomorrow, 11:00 AM - 1:00 PM</span>
                </div>
                <div className="flex items-center mt-1">
                  <Users className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-sm text-muted-foreground">Dr. Williams</span>
                </div>
              </div>
              
              <Badge>Required</Badge>
            </div>
            
            <div className="flex items-start gap-4 p-4 border rounded-md">
              <div className="bg-primary/10 rounded-full p-3">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium">Chemistry Tutorial</h3>
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-sm text-muted-foreground">Day After Tomorrow, 3:00 PM - 4:30 PM</span>
                </div>
                <div className="flex items-center mt-1">
                  <Users className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-sm text-muted-foreground">Dr. Smith</span>
                </div>
              </div>
              
              <Badge variant="outline">Optional</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 