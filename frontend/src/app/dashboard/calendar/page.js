"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus, 
  Check, 
  BookOpen, 
  Users, 
  Video, 
  BookMarked,
  Presentation
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Math Lecture",
      date: "2023-06-15",
      time: "10:00 AM - 11:30 AM",
      type: "lecture",
      location: "Room 101",
      instructor: "Dr. Johnson"
    },
    {
      id: 2,
      title: "Physics Lab",
      date: "2023-06-15",
      time: "1:00 PM - 3:00 PM",
      type: "lab",
      location: "Science Building B12",
      instructor: "Prof. Smith"
    },
    {
      id: 3,
      title: "Literature Study Group",
      date: "2023-06-16",
      time: "4:00 PM - 5:30 PM",
      type: "study",
      location: "Library Study Room 3",
      instructor: null
    },
    {
      id: 4,
      title: "Chemistry Quiz",
      date: "2023-06-17",
      time: "9:00 AM - 10:00 AM",
      type: "exam",
      location: "Room 203",
      instructor: "Dr. Williams"
    },
    {
      id: 5,
      title: "Computer Science Project Meeting",
      date: "2023-06-18",
      time: "2:00 PM - 3:30 PM",
      type: "meeting",
      location: "Tech Center",
      instructor: "Prof. Lee"
    },
    {
      id: 6,
      title: "Virtual Language Class",
      date: "2023-06-19",
      time: "11:00 AM - 12:30 PM",
      type: "online",
      location: "Zoom Meeting",
      instructor: "Ms. Garcia"
    }
  ]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEventIcon = (type) => {
    switch(type) {
      case "lecture":
        return <Presentation className="h-4 w-4 text-blue-600" />;
      case "lab":
        return <BookOpen className="h-4 w-4 text-green-600" />;
      case "study":
        return <BookMarked className="h-4 w-4 text-yellow-600" />;
      case "exam":
        return <Check className="h-4 w-4 text-red-600" />;
      case "meeting":
        return <Users className="h-4 w-4 text-purple-600" />;
      case "online":
        return <Video className="h-4 w-4 text-cyan-600" />;
      default:
        return <CalendarIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const renderCalendar = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
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
        const dayEvents = events.filter(event => event.date === formattedDate);
        const isCurrentMonth = day.getMonth() === currentDate.getMonth();
        
        days.push(
          <div 
            key={day.toISOString()} 
            className={`
              min-h-[120px] p-2 border border-border rounded-md
              ${isCurrentMonth ? 'bg-background' : 'bg-muted/30 text-muted-foreground'}
              ${day.toDateString() === new Date().toDateString() ? 'ring-2 ring-primary ring-offset-1' : ''}
            `}
          >
            <p className="text-sm font-medium mb-2">{day.getDate()}</p>
            
            {dayEvents.slice(0, 2).map((event) => (
              <div 
                key={event.id} 
                className="flex items-center gap-1 text-xs p-1 rounded bg-primary/10 mb-1 overflow-hidden"
              >
                {getEventIcon(event.type)}
                <span className="truncate">{event.title}</span>
              </div>
            ))}
            
            {dayEvents.length > 2 && (
              <div className="text-xs text-muted-foreground text-center mt-1">
                +{dayEvents.length - 2} more
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          View and manage your academic schedule and events.
        </p>
      </div>
      
      <Tabs defaultValue="month" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
          </TabsList>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
        
        <TabsContent value="month" className="space-y-4">
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
                    {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={goToNextMonth}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
              </div>
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
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="week" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Week View</CardTitle>
              <CardDescription>
                View your schedule for the week.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[500px] flex items-center justify-center bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Week view will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="day" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Day View</CardTitle>
              <CardDescription>
                View your schedule for the day.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[500px] flex items-center justify-center bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Day view will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="agenda" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                A chronological list of your upcoming events.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .map((event) => (
                    <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="bg-primary/10 rounded-md p-2">
                        {getEventIcon(event.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{event.title}</h3>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              <span>{event.date}</span>
                              <span className="mx-1">•</span>
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{event.time}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {event.type}
                          </Badge>
                        </div>
                        
                        <div className="mt-3 text-sm">
                          <p className="mb-1"><span className="font-medium">Location:</span> {event.location}</p>
                          {event.instructor && (
                            <p><span className="font-medium">Instructor:</span> {event.instructor}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 