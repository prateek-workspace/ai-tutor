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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Checkbox,
  CheckboxIndicator,
} from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, Clock, ClipboardList, CheckCircle2, 
  AlertCircle, MoreHorizontal, Plus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function TasksPage() {
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: "Math Assignment", 
      description: "Complete linear algebra problems 1-10", 
      dueDate: "2023-06-10", 
      status: "pending", 
      priority: "high", 
      category: "assignment"
    },
    { 
      id: 2, 
      title: "Physics Lab Report", 
      description: "Write summary of experiment findings", 
      dueDate: "2023-06-15", 
      status: "pending", 
      priority: "medium", 
      category: "assignment"
    },
    { 
      id: 3, 
      title: "Literature Essay", 
      description: "1500 word analysis of Shakespeare's Hamlet", 
      dueDate: "2023-06-20", 
      status: "pending", 
      priority: "medium", 
      category: "assignment"
    },
    { 
      id: 4, 
      title: "Chemistry Quiz", 
      description: "Study organic chemistry concepts", 
      dueDate: "2023-06-12", 
      status: "pending", 
      priority: "high", 
      category: "quiz"
    },
    { 
      id: 5, 
      title: "Computer Science Project", 
      description: "Finish coding the final project", 
      dueDate: "2023-06-25", 
      status: "completed", 
      priority: "high", 
      category: "project"
    }
  ]);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "high": return "text-destructive";
      case "medium": return "text-amber-500";
      case "low": return "text-primary";
      default: return "text-muted-foreground";
    }
  };

  const getCategoryBadge = (category) => {
    switch(category) {
      case "assignment":
        return <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200">Assignment</Badge>;
      case "quiz":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Quiz</Badge>;
      case "project":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Project</Badge>;
      case "exam":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Exam</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  const toggleTaskStatus = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? 
        {...task, status: task.status === "completed" ? "pending" : "completed"} 
        : task
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground">
          Manage your assignments, quizzes, and projects.
        </p>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Tasks</CardTitle>
              <CardDescription>
                View and manage all your educational tasks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <Checkbox 
                      id={`task-${task.id}`} 
                      checked={task.status === "completed"}
                      onCheckedChange={() => toggleTaskStatus(task.id)}
                      className="mt-1"
                    />
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                            {task.title}
                          </h3>
                          {getCategoryBadge(task.category)}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                            <DropdownMenuItem>Mark as {task.status === "completed" ? "Pending" : "Completed"}</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span>Due {task.dueDate}</span>
                        </div>
                        
                        <div className={`flex items-center text-sm ${getPriorityColor(task.priority)}`}>
                          <AlertCircle className="w-4 h-4 mr-1" />
                          <span className="capitalize">{task.priority} Priority</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Tasks</CardTitle>
              <CardDescription>
                View and manage your pending tasks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.filter(task => task.status === "pending").map((task) => (
                  <div key={task.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <Checkbox 
                      id={`task-${task.id}`} 
                      checked={false}
                      onCheckedChange={() => toggleTaskStatus(task.id)}
                      className="mt-1"
                    />
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{task.title}</h3>
                          {getCategoryBadge(task.category)}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                            <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span>Due {task.dueDate}</span>
                        </div>
                        
                        <div className={`flex items-center text-sm ${getPriorityColor(task.priority)}`}>
                          <AlertCircle className="w-4 h-4 mr-1" />
                          <span className="capitalize">{task.priority} Priority</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Tasks</CardTitle>
              <CardDescription>
                View your completed tasks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.filter(task => task.status === "completed").map((task) => (
                  <div key={task.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <Checkbox 
                      id={`task-${task.id}`} 
                      checked={true}
                      onCheckedChange={() => toggleTaskStatus(task.id)}
                      className="mt-1"
                    />
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium line-through text-muted-foreground">{task.title}</h3>
                          {getCategoryBadge(task.category)}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                            <DropdownMenuItem>Mark as Pending</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span>Due {task.dueDate}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-green-600">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          <span>Completed</span>
                        </div>
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