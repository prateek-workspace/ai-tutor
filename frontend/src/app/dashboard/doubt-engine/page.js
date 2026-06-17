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
  MessageSquare, 
  Send, 
  HelpCircle, 
  BookOpen, 
  Clock, 
  Search,
  BarChart3,
  RefreshCw,
  ChevronRight,
  Bookmark,
  PlusCircle,
  History,
  ArrowRightLeft,
  CheckCircle2,
  Filter,
  Users,
  Lightbulb,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DoubtEnginePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  
  const subjects = [
    { id: "math", name: "Mathematics", icon: "📐" },
    { id: "physics", name: "Physics", icon: "⚛️" },
    { id: "chemistry", name: "Chemistry", icon: "🧪" },
    { id: "biology", name: "Biology", icon: "🧬" },
    { id: "literature", name: "Literature", icon: "📚" },
    { id: "history", name: "History", icon: "🏛️" },
    { id: "cs", name: "Computer Science", icon: "💻" }
  ];
  
  const recentQuestions = [
    {
      id: 1,
      subject: "math",
      title: "How to solve quadratic equations?",
      date: "2023-06-10T14:30:00Z",
      resolved: true,
      answers: 3
    },
    {
      id: 2,
      subject: "physics",
      title: "Explanation of Newton's third law of motion",
      date: "2023-06-09T10:15:00Z",
      resolved: true,
      answers: 2
    },
    {
      id: 3,
      subject: "chemistry",
      title: "Difference between covalent and ionic bonding",
      date: "2023-06-08T16:45:00Z",
      resolved: false,
      answers: 1
    },
    {
      id: 4,
      subject: "literature",
      title: "Analysis of metaphors in Hamlet",
      date: "2023-06-07T11:20:00Z",
      resolved: true,
      answers: 4
    }
  ];
  
  const chats = [
    {
      id: 1,
      subject: "Mathematics",
      title: "How to solve quadratic equations?",
      date: "2023-06-10",
      messages: [
        {
          id: 1,
          role: "user",
          content: "I'm having trouble solving quadratic equations. Can someone explain the different methods?",
          timestamp: "2023-06-10T14:30:00Z"
        },
        {
          id: 2,
          role: "tutor",
          tutor: "Dr. Johnson",
          content: "There are several methods to solve quadratic equations:\n\n1. Factoring: If you can factor the equation into (ax + b)(cx + d) = 0, then you can set each factor equal to zero and solve.\n\n2. Quadratic Formula: x = (-b ± √(b² - 4ac)) / 2a for any equation in the form ax² + bx + c = 0.\n\n3. Completing the Square: Rearranging the equation to get it in the form (x + p)² = q.\n\nWhich one are you struggling with specifically?",
          timestamp: "2023-06-10T14:35:00Z"
        },
        {
          id: 3,
          role: "user",
          content: "I find the quadratic formula confusing. How do I know which sign to use with the ± part?",
          timestamp: "2023-06-10T14:40:00Z"
        },
        {
          id: 4,
          role: "tutor",
          tutor: "Dr. Johnson",
          content: "Great question! The ± gives you both solutions to the equation.\n\nWhen you use the formula x = (-b ± √(b² - 4ac)) / 2a, you'll actually get two answers:\n\nx₁ = (-b + √(b² - 4ac)) / 2a\nx₂ = (-b - √(b² - 4ac)) / 2a\n\nBoth of these values are solutions to the original equation. You should verify both by plugging them back into the original equation.",
          timestamp: "2023-06-10T14:45:00Z"
        },
        {
          id: 5,
          role: "user",
          content: "That makes sense! Can you show me an example with the equation x² - 5x + 6 = 0?",
          timestamp: "2023-06-10T14:50:00Z"
        },
        {
          id: 6,
          role: "tutor",
          tutor: "Dr. Johnson",
          content: "Sure! For x² - 5x + 6 = 0, we have a = 1, b = -5, and c = 6.\n\nUsing the quadratic formula:\nx = (-(-5) ± √((-5)² - 4(1)(6))) / 2(1)\nx = (5 ± √(25 - 24)) / 2\nx = (5 ± √1) / 2\nx = (5 ± 1) / 2\n\nSo x₁ = (5 + 1) / 2 = 3\nAnd x₂ = (5 - 1) / 2 = 2\n\nWe can verify: \n- For x = 3: 3² - 5(3) + 6 = 9 - 15 + 6 = 0 ✓\n- For x = 2: 2² - 5(2) + 6 = 4 - 10 + 6 = 0 ✓",
          timestamp: "2023-06-10T14:55:00Z"
        }
      ]
    },
    {
      id: 2,
      subject: "Physics",
      title: "Explanation of Newton's third law of motion",
      date: "2023-06-09",
      messages: [
        {
          id: 1,
          role: "user",
          content: "Can someone explain Newton's third law of motion with some real-world examples?",
          timestamp: "2023-06-09T10:15:00Z"
        },
        {
          id: 2,
          role: "tutor",
          tutor: "Prof. Williams",
          content: "Newton's third law states: 'For every action, there is an equal and opposite reaction.'\n\nHere are some examples:\n\n1. When you push against a wall, the wall pushes back with equal force.\n\n2. When a bird flies, it pushes air downward (action), and the air pushes the bird upward (reaction).\n\n3. A rocket propels itself by expelling gas backward (action), and the gas pushes the rocket forward (reaction).\n\nDoes that help clarify the concept?",
          timestamp: "2023-06-09T10:25:00Z"
        }
      ]
    }
  ];
  
  const popularTopics = [
    "Calculus Integration Techniques",
    "Organic Chemistry Reactions",
    "Literary Analysis Methods",
    "Quantum Mechanics Principles",
    "Data Structures and Algorithms",
    "Cell Biology Fundamentals",
    "Macroeconomics Concepts"
  ];
  
  const handleAskQuestion = () => {
    if (!currentQuestion.trim()) return;
    
    setIsAsking(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsAsking(false);
      setCurrentQuestion("");
      // Show notification or navigate to created question
    }, 1500);
  };
  
  const filteredQuestions = recentQuestions.filter(question => 
    question.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Doubt Engine</h1>
        <p className="text-muted-foreground">
          Get your academic questions answered by tutors and peers.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Questions Asked
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              This semester
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Response Rate
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              Average response time: 15 minutes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Resolved Doubts
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21</div>
            <p className="text-xs text-muted-foreground">
              87.5% resolution rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Tutors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Online now
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-6">
        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ask a Question</CardTitle>
              <CardDescription>
                Get help with your academic doubts and questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {subjects.slice(0, 5).map((subject) => (
                      <Badge key={subject.id} variant="outline" className="cursor-pointer hover:bg-primary/10">
                        {subject.icon} {subject.name}
                      </Badge>
                    ))}
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                      +{subjects.length - 5} more
                    </Badge>
                  </div>
                </div>
                
                <Textarea 
                  placeholder="Type your question here... Be specific for better answers."
                  rows={4}
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                  className="resize-none"
                />
                
                <div className="text-xs text-muted-foreground">
                  Tip: Include relevant details and be clear about what you're trying to understand.
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-1" />
                    Attach
                  </Button>
                  <Button variant="outline" size="sm">
                    <BookOpen className="h-4 w-4 mr-1" />
                    Browse Similar
                  </Button>
                </div>
                
                <Button 
                  onClick={handleAskQuestion} 
                  disabled={!currentQuestion.trim() || isAsking}
                >
                  {isAsking ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Question
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="recent" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="recent">Recent Questions</TabsTrigger>
                <TabsTrigger value="yours">Your Questions</TabsTrigger>
                <TabsTrigger value="popular">Popular Topics</TabsTrigger>
              </TabsList>
              
              <div className="relative w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <TabsContent value="recent" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {filteredQuestions.length > 0 ? (
                      filteredQuestions.map((question) => (
                        <div 
                          key={question.id} 
                          className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                          onClick={() => setSelectedChat(question.id)}
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                            {subjects.find(s => s.id === question.subject)?.icon}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{question.title}</h3>
                                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                  <Badge variant="outline" className="mr-2">
                                    {subjects.find(s => s.id === question.subject)?.name}
                                  </Badge>
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>{formatDate(question.date)}</span>
                                </div>
                              </div>
                              {question.resolved ? (
                                <Badge className="bg-green-50 text-green-700 border-green-200">
                                  Resolved
                                </Badge>
                              ) : (
                                <Badge variant="outline">
                                  {question.answers} {question.answers === 1 ? 'Answer' : 'Answers'}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <Button variant="ghost" size="icon">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No questions found</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          Try using different search terms or browse popular topics.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="yours" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentQuestions.filter(q => q.id % 2 === 0).map((question) => (
                      <div 
                        key={question.id} 
                        className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => setSelectedChat(question.id)}
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                          {subjects.find(s => s.id === question.subject)?.icon}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{question.title}</h3>
                              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                <Badge variant="outline" className="mr-2">
                                  {subjects.find(s => s.id === question.subject)?.name}
                                </Badge>
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{formatDate(question.date)}</span>
                              </div>
                            </div>
                            {question.resolved ? (
                              <Badge className="bg-green-50 text-green-700 border-green-200">
                                Resolved
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                {question.answers} {question.answers === 1 ? 'Answer' : 'Answers'}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="popular" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {popularTopics.map((topic, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Lightbulb className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{topic}</h3>
                          <p className="text-xs text-muted-foreground">
                            {Math.floor(Math.random() * 100) + 10} related questions
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Active Conversations</CardTitle>
              <CardDescription>
                Continue your discussions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedChat ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">
                        {chats.find(c => c.id === selectedChat)?.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {chats.find(c => c.id === selectedChat)?.subject} • {chats.find(c => c.id === selectedChat)?.date}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedChat(null)}>
                      <ArrowRightLeft className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {chats.find(c => c.id === selectedChat)?.messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                        >
                          {message.role !== 'user' && (
                            <Avatar>
                              <AvatarFallback>{message.tutor?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div className={`
                            max-w-[80%] p-3 rounded-lg
                            ${message.role === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'}
                          `}>
                            {message.role !== 'user' && (
                              <div className="font-medium text-sm mb-1">{message.tutor}</div>
                            )}
                            <div className="text-sm whitespace-pre-line">{message.content}</div>
                            <div className="text-xs mt-1 text-right opacity-70">
                              {formatDate(message.timestamp)}
                            </div>
                          </div>
                          
                          {message.role === 'user' && (
                            <Avatar>
                              <AvatarFallback>ME</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  <div className="pt-2">
                    <div className="flex gap-2">
                      <Textarea 
                        placeholder="Type your reply..." 
                        className="min-h-[80px]"
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-1" />
                          Attach
                        </Button>
                      </div>
                      <Button>
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center h-full text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Conversation Selected</h3>
                  <p className="text-muted-foreground max-w-[250px] mb-4">
                    Click on a question from the recent list to view the conversation.
                  </p>
                  <Button variant="outline" onClick={() => setSelectedChat(1)}>
                    View Sample Conversation
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Expert Tutors</CardTitle>
          <CardDescription>
            Connect with tutors specialized in different subjects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarFallback>DJ</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="font-medium">Dr. Johnson</h3>
                <p className="text-sm text-muted-foreground">Mathematics</p>
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {Array(5).fill(null).map((_, i) => (
                      <svg key={i} width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-500">
                        <path d="M7.5 0L9.18386 5.18237H14.6329L10.2245 8.38525L11.9084 13.5676L7.5 10.3647L3.09161 13.5676L4.77547 8.38525L0.367076 5.18237H5.81614L7.5 0Z" fill="currentColor" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs ml-1">4.9</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                Connect
              </Button>
            </div>
            
            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarFallback>PW</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="font-medium">Prof. Williams</h3>
                <p className="text-sm text-muted-foreground">Physics</p>
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {Array(5).fill(null).map((_, i) => (
                      <svg key={i} width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-500">
                        <path d="M7.5 0L9.18386 5.18237H14.6329L10.2245 8.38525L11.9084 13.5676L7.5 10.3647L3.09161 13.5676L4.77547 8.38525L0.367076 5.18237H5.81614L7.5 0Z" fill="currentColor" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs ml-1">4.8</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                Connect
              </Button>
            </div>
            
            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarFallback>MG</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="font-medium">Ms. Garcia</h3>
                <p className="text-sm text-muted-foreground">Literature</p>
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {Array(5).fill(null).map((_, i) => (
                      <svg key={i} width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className={i < 4 ? "text-amber-500" : "text-muted"}>
                        <path d="M7.5 0L9.18386 5.18237H14.6329L10.2245 8.38525L11.9084 13.5676L7.5 10.3647L3.09161 13.5676L4.77547 8.38525L0.367076 5.18237H5.81614L7.5 0Z" fill="currentColor" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs ml-1">4.5</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                Connect
              </Button>
            </div>
            
            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarFallback>DS</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="font-medium">Dr. Smith</h3>
                <p className="text-sm text-muted-foreground">Chemistry</p>
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {Array(5).fill(null).map((_, i) => (
                      <svg key={i} width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-500">
                        <path d="M7.5 0L9.18386 5.18237H14.6329L10.2245 8.38525L11.9084 13.5676L7.5 10.3647L3.09161 13.5676L4.77547 8.38525L0.367076 5.18237H5.81614L7.5 0Z" fill="currentColor" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs ml-1">4.9</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                Connect
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <Users className="h-4 w-4 mr-2" />
            View All Tutors
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 