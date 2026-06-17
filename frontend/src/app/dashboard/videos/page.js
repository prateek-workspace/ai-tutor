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
import { Input } from "@/components/ui/input";
import {
  Play,
  Clock,
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  Search,
  BookOpen,
  Filter,
  ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function VideosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState([
    {
      id: 1,
      title: "Introduction to Calculus",
      thumbnail: "https://i.imgur.com/8Z1BAdm.jpg",
      duration: "45:12",
      instructor: "Prof. Johnson",
      subject: "Mathematics",
      date: "2023-06-10",
      watched: true,
      bookmarked: true,
      progress: 100,
      description: "Learn the fundamentals of calculus including limits, derivatives, and integrals."
    },
    {
      id: 2,
      title: "Chemical Reactions and Equations",
      thumbnail: "https://i.imgur.com/KLhdgCZ.jpg",
      duration: "38:45",
      instructor: "Dr. Smith",
      subject: "Chemistry",
      date: "2023-06-12",
      watched: true,
      bookmarked: false,
      progress: 100,
      description: "Understand balanced equations and different types of chemical reactions."
    },
    {
      id: 3,
      title: "Literary Analysis Techniques",
      thumbnail: "https://i.imgur.com/Brkm0cH.jpg",
      duration: "52:30",
      instructor: "Ms. Garcia",
      subject: "Literature",
      date: "2023-06-15",
      watched: false,
      bookmarked: true,
      progress: 35,
      description: "Explore various techniques for analyzing and interpreting literary works."
    },
    {
      id: 4,
      title: "Laws of Motion",
      thumbnail: "https://i.imgur.com/zVNfCpz.jpg",
      duration: "41:18",
      instructor: "Dr. Williams",
      subject: "Physics",
      date: "2023-06-18",
      watched: false,
      bookmarked: false,
      progress: 65,
      description: "Dive into Newton's laws of motion and their applications in everyday physics."
    },
    {
      id: 5,
      title: "Web Development Fundamentals",
      thumbnail: "https://i.imgur.com/QD0ktre.jpg",
      duration: "1:05:22",
      instructor: "Mr. Lee",
      subject: "Computer Science",
      date: "2023-06-20",
      watched: false,
      bookmarked: true,
      progress: 20,
      description: "Learn HTML, CSS, and JavaScript basics for building modern websites."
    },
    {
      id: 6,
      title: "Cellular Structure and Function",
      thumbnail: "https://i.imgur.com/0qU3w2J.jpg",
      duration: "48:55",
      instructor: "Dr. Martinez",
      subject: "Biology",
      date: "2023-06-22",
      watched: false,
      bookmarked: false,
      progress: 0,
      description: "Explore the structures and functions of different types of cells."
    }
  ]);

  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderVideoCard = (video) => (
    <Card key={video.id} className="overflow-hidden">
      <div className="relative">
        <div className="aspect-video bg-muted overflow-hidden">
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Button variant="secondary" size="icon" className="rounded-full">
              <Play className="h-6 w-6" />
            </Button>
          </div>
          {video.progress > 0 && video.progress < 100 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${video.progress}%` }}
              ></div>
            </div>
          )}
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
          {video.bookmarked && (
            <div className="bg-background/80 p-1 rounded-md">
              <BookmarkCheck className="h-4 w-4 text-primary" />
            </div>
          )}
          <div className="bg-background/80 p-1 rounded-md">
            <Clock className="h-4 w-4" />
            <span className="text-xs ml-1">{video.duration}</span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2 line-clamp-1">{video.title}</h3>
        <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
          <span>{video.instructor}</span>
          <Badge variant="outline">{video.subject}</Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center text-xs text-muted-foreground">
          <CalendarDays className="h-3 w-3 mr-1" />
          <span>{video.date}</span>
        </div>
        
        <Button variant="ghost" size="sm" className="rounded-full h-8 px-2">
          Watch Now
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lecture Videos</h1>
        <p className="text-muted-foreground">
          Browse and watch educational videos from your courses.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search videos by title, subject, or instructor"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>All Videos</DropdownMenuItem>
            <DropdownMenuItem>Watched</DropdownMenuItem>
            <DropdownMenuItem>Unwatched</DropdownMenuItem>
            <DropdownMenuItem>Bookmarked</DropdownMenuItem>
            <DropdownMenuItem>Recently Added</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Videos</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map(renderVideoCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="in-progress" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos
              .filter(video => video.progress > 0 && video.progress < 100)
              .map(renderVideoCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="bookmarked" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos
              .filter(video => video.bookmarked)
              .map(renderVideoCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos
              .filter(video => video.progress === 100)
              .map(renderVideoCard)}
          </div>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Recommended For You</CardTitle>
          <CardDescription>
            Based on your recent activity and courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {videos.slice(0, 3).map(video => (
              <div key={video.id} className="flex gap-4 items-start">
                <div className="relative flex-shrink-0">
                  <div className="w-32 h-20 overflow-hidden rounded-md">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="icon" className="rounded-full h-8 w-8">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium">{video.title}</h3>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{video.instructor}</span>
                    <span>{video.duration}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <BookOpen className="h-3 w-3 text-muted-foreground mr-1" />
                    <span className="text-xs text-muted-foreground">{video.subject}</span>
                  </div>
                </div>
                
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">View All Recommendations</Button>
        </CardFooter>
      </Card>
    </div>
  );
} 