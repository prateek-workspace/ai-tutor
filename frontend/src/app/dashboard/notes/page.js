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
  Pencil, 
  Search, 
  Plus, 
  Bookmark,
  BookOpen,
  Clock,
  Share2,
  MoreVertical,
  Star,
  FolderOpen,
  FileText,
  ChevronRight,
  CheckCircle2,
  Calendar,
  List,
  Layout,
  Tag,
  Filter,
  Menu,
  FileImage,
  FileAudio,
  FileVideo,
  FileText as FileIcon,
  Trash2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid, list
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [noteSort, setNoteSort] = useState("date"); // date, title, importance
  
  const folders = [
    { id: "all", name: "All Notes", count: 28 },
    { id: "recent", name: "Recent", count: 12 },
    { id: "favorites", name: "Favorites", count: 8 },
    { id: "shared", name: "Shared with me", count: 5 },
    { id: "trash", name: "Trash", count: 3 },
    { id: "math", name: "Mathematics", count: 10 },
    { id: "physics", name: "Physics", count: 7 },
    { id: "chemistry", name: "Chemistry", count: 5 },
    { id: "biology", name: "Biology", count: 6 }
  ];

  const tags = [
    { id: "lectures", name: "Lectures", color: "bg-blue-100 text-blue-800" },
    { id: "assignments", name: "Assignments", color: "bg-green-100 text-green-800" },
    { id: "exam-prep", name: "Exam Prep", color: "bg-orange-100 text-orange-800" },
    { id: "research", name: "Research", color: "bg-purple-100 text-purple-800" },
    { id: "projects", name: "Projects", color: "bg-pink-100 text-pink-800" }
  ];
  
  const notes = [
    {
      id: 1,
      title: "Calculus - Integration Techniques",
      folder: "math",
      preview: "Methods for solving integration problems: substitution, parts, partial fractions...",
      date: "2023-06-12T14:30:00Z",
      lastModified: "2023-06-15T09:45:00Z",
      tags: ["lectures", "exam-prep"],
      starred: true,
      color: "#e0f7fa", // light blue
      type: "text",
      collaborators: []
    },
    {
      id: 2,
      title: "Physics Lab Notes - Oscillation Experiment",
      folder: "physics",
      preview: "Results from the pendulum experiment. Measured periods for different lengths...",
      date: "2023-06-10T11:20:00Z",
      lastModified: "2023-06-10T16:15:00Z",
      tags: ["assignments", "research"],
      starred: false,
      color: "#f3e5f5", // light purple
      type: "text",
      collaborators: [
        { id: 1, name: "Alex Johnson", avatar: "AJ" }
      ]
    },
    {
      id: 3,
      title: "Organic Chemistry Reaction Pathways",
      folder: "chemistry",
      preview: "SN1 and SN2 reactions, E1 and E2 elimination mechanisms, and their conditions...",
      date: "2023-06-09T09:00:00Z",
      lastModified: "2023-06-14T13:30:00Z",
      tags: ["lectures", "exam-prep"],
      starred: true,
      color: "#e8f5e9", // light green
      type: "text",
      collaborators: []
    },
    {
      id: 4,
      title: "Cell Division Diagram",
      folder: "biology",
      preview: "Visual representation of mitosis and meiosis processes with detailed annotations...",
      date: "2023-06-08T10:15:00Z",
      lastModified: "2023-06-08T10:15:00Z",
      tags: ["lectures"],
      starred: false,
      color: "#fff3e0", // light orange
      type: "image",
      collaborators: []
    },
    {
      id: 5,
      title: "Thermodynamics Lecture Recording",
      folder: "physics",
      preview: "Audio recording of Prof. Smith's lecture on the laws of thermodynamics...",
      date: "2023-06-07T15:45:00Z",
      lastModified: "2023-06-07T15:45:00Z",
      tags: ["lectures"],
      starred: false,
      color: "#fce4ec", // light pink
      type: "audio",
      collaborators: []
    },
    {
      id: 6,
      title: "Research Project - Data Analysis",
      folder: "math",
      preview: "Statistical analysis results from the survey data. Includes regression models...",
      date: "2023-06-05T13:20:00Z",
      lastModified: "2023-06-13T11:00:00Z",
      tags: ["research", "projects"],
      starred: true,
      color: "#f1f8e9", // light lime
      type: "text",
      collaborators: [
        { id: 1, name: "Alex Johnson", avatar: "AJ" },
        { id: 2, name: "Sarah Peterson", avatar: "SP" }
      ]
    },
    {
      id: 7,
      title: "DNA Replication Process Video Notes",
      folder: "biology",
      preview: "Notes on the educational video covering DNA replication mechanisms...",
      date: "2023-06-03T09:30:00Z",
      lastModified: "2023-06-03T09:30:00Z",
      tags: ["lectures", "exam-prep"],
      starred: false,
      color: "#e1f5fe", // light cyan
      type: "video",
      collaborators: []
    },
    {
      id: 8,
      title: "Physics Problem Set Solutions",
      folder: "physics",
      preview: "Solutions to week 5 problem set on waves and optics...",
      date: "2023-06-01T14:00:00Z",
      lastModified: "2023-06-01T17:30:00Z",
      tags: ["assignments"],
      starred: false,
      color: "#fff8e1", // light amber
      type: "text",
      collaborators: []
    }
  ];
  
  // Filter notes by selected folder and search query
  const filteredNotes = notes.filter(note => {
    // Filter by folder
    if (selectedFolder !== "all") {
      if (selectedFolder === "recent") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const noteDate = new Date(note.lastModified);
        if (noteDate < oneWeekAgo) return false;
      } else if (selectedFolder === "favorites") {
        if (!note.starred) return false;
      } else if (selectedFolder === "shared") {
        if (note.collaborators.length === 0) return false;
      } else if (note.folder !== selectedFolder) {
        return false;
      }
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(query) ||
        note.preview.toLowerCase().includes(query) ||
        note.tags.some(tag => 
          tags.find(t => t.id === tag)?.name.toLowerCase().includes(query)
        )
      );
    }
    
    return true;
  });
  
  // Sort notes
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (noteSort === "title") {
      return a.title.localeCompare(b.title);
    } else if (noteSort === "importance") {
      // Sort by starred status first, then by date
      return (b.starred ? 1 : 0) - (a.starred ? 1 : 0) || 
             new Date(b.lastModified) - new Date(a.lastModified);
    } else {
      // Default sort by date
      return new Date(b.lastModified) - new Date(a.lastModified);
    }
  });
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  const getTypeIcon = (type) => {
    switch (type) {
      case "image":
        return <FileImage className="h-5 w-5" />;
      case "audio":
        return <FileAudio className="h-5 w-5" />;
      case "video":
        return <FileVideo className="h-5 w-5" />;
      case "text":
      default:
        return <FileIcon className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notes & Documents</h1>
        <p className="text-muted-foreground">
          Manage your study notes, documents, and learning materials
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Notes
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notes.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {folders.length - 4} subject folders
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recently Modified
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Updated in the last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Important Notes
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notes.filter(n => n.starred).length}</div>
            <p className="text-xs text-muted-foreground">
              Starred for easy access
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Shared With Me
            </CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notes.filter(n => n.collaborators.length > 0).length}</div>
            <p className="text-xs text-muted-foreground">
              Collaborative documents
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Folders</CardTitle>
              <CardDescription>
                Organize your notes by subject
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {folders.map((folder) => (
                  <div 
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`
                      flex items-center justify-between p-2 rounded-md cursor-pointer
                      ${selectedFolder === folder.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {folder.id === "all" ? (
                        <BookOpen className="h-5 w-5" />
                      ) : folder.id === "recent" ? (
                        <Clock className="h-5 w-5" />
                      ) : folder.id === "favorites" ? (
                        <Star className="h-5 w-5" />
                      ) : folder.id === "shared" ? (
                        <Share2 className="h-5 w-5" />
                      ) : folder.id === "trash" ? (
                        <Trash2 className="h-5 w-5" />
                      ) : (
                        <FolderOpen className="h-5 w-5" />
                      )}
                      <span>{folder.name}</span>
                    </div>
                    <Badge variant="outline">{folder.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                New Folder
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Categorize notes by purpose
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag.id} className={tag.color}>
                    {tag.name}
                  </Badge>
                ))}
                <Badge variant="outline" className="cursor-pointer">
                  <Plus className="h-3 w-3 mr-1" />
                  New Tag
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Storage</CardTitle>
              <CardDescription>
                Cloud storage usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Used</span>
                    <span>2.4 GB of 15 GB</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: "16%" }}></div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Storage by type</h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span>Documents</span>
                      </div>
                      <span>860 MB</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span>Images</span>
                      </div>
                      <span>540 MB</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                        <span>Audio</span>
                      </div>
                      <span>350 MB</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span>Videos</span>
                      </div>
                      <span>650 MB</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Upgrade Storage
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="md:col-span-4 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    <span>Date Created</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Date Modified</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Tag className="h-4 w-4 mr-2" />
                    <span>Tags</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FolderOpen className="h-4 w-4 mr-2" />
                    <span>Folder</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={noteSort} onValueChange={setNoteSort}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date Modified</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="importance">Importance</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center border rounded-md overflow-hidden">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={viewMode === "grid" ? "bg-muted" : ""}
                  onClick={() => setViewMode("grid")}
                >
                  <Layout className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={viewMode === "list" ? "bg-muted" : ""}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              <Button className="hidden sm:flex">
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">
                {selectedFolder === "all" 
                  ? "All Notes" 
                  : folders.find(f => f.id === selectedFolder)?.name}
                {filteredNotes.length > 0 && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"})
                  </span>
                )}
              </h2>
              <Button className="sm:hidden">
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </div>
            
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12 border rounded-md">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No notes found</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-4">
                  {searchQuery 
                    ? "Try using different search terms or removing filters." 
                    : "Get started by creating your first note in this folder."}
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Note
                </Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedNotes.map((note) => (
                  <Card key={note.id} className="overflow-hidden" style={{ backgroundColor: note.color }}>
                    <CardHeader className="p-4 pb-0 flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base font-medium line-clamp-2">
                          {note.title}
                        </CardTitle>
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatDate(note.lastModified)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        {note.starred && (
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          </Button>
                        )}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Pencil className="h-4 w-4 mr-2" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="h-4 w-4 mr-2" />
                              <span>Share</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {note.starred ? (
                                <>
                                  <Star className="h-4 w-4 mr-2" />
                                  <span>Remove Star</span>
                                </>
                              ) : (
                                <>
                                  <Star className="h-4 w-4 mr-2" />
                                  <span>Add Star</span>
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-4 pt-3">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-background/80 mr-2">
                          {getTypeIcon(note.type)}
                        </div>
                        <p className="text-xs text-muted-foreground capitalize">{note.type} Note</p>
                      </div>
                      
                      <p className="text-sm line-clamp-3">{note.preview}</p>
                      
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {note.tags.map((tagId) => {
                          const tag = tags.find(t => t.id === tagId);
                          return tag ? (
                            <Badge key={tagId} className={tag.color + " text-xs"}>
                              {tag.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-4 pt-0 flex items-center justify-between">
                      {note.collaborators.length > 0 ? (
                        <div className="flex -space-x-2">
                          {note.collaborators.map((collab, idx) => (
                            <Avatar key={idx} className="h-6 w-6 border-2 border-background">
                              <AvatarFallback className="text-xs">{collab.avatar}</AvatarFallback>
                            </Avatar>
                          ))}
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs border-2 border-background">
                            +{note.collaborators.length + 1}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Only you</span>
                      )}
                      
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        Open
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-muted/40 border-b text-sm font-medium">
                  <div className="flex-1">Name</div>
                  <div className="w-24 text-center">Type</div>
                  <div className="w-32 text-center">Last Modified</div>
                  <div className="w-20 text-center">Actions</div>
                </div>
                
                <div className="divide-y">
                  {sortedNotes.map((note) => (
                    <div key={note.id} className="flex items-center px-4 py-3 hover:bg-muted/20">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 flex items-center justify-center rounded-md" style={{ backgroundColor: note.color }}>
                            {getTypeIcon(note.type)}
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium truncate">{note.title}</h3>
                              {note.starred && (
                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              <span>
                                {folders.find(f => f.id === note.folder)?.name}
                              </span>
                              
                              {note.tags.length > 0 && (
                                <>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    {note.tags.slice(0, 2).map((tagId) => {
                                      const tag = tags.find(t => t.id === tagId);
                                      return tag ? (
                                        <span key={tagId}>{tag.name}</span>
                                      ) : null;
                                    })}
                                    {note.tags.length > 2 && (
                                      <span>+{note.tags.length - 2} more</span>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-24 text-center">
                        <Badge variant="outline" className="capitalize text-xs">
                          {note.type}
                        </Badge>
                      </div>
                      
                      <div className="w-32 text-center text-sm text-muted-foreground">
                        {formatDate(note.lastModified)}
                      </div>
                      
                      <div className="w-20 flex justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Pencil className="h-4 w-4 mr-2" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="h-4 w-4 mr-2" />
                              <span>Share</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {note.starred ? (
                                <>
                                  <Star className="h-4 w-4 mr-2" />
                                  <span>Remove Star</span>
                                </>
                              ) : (
                                <>
                                  <Star className="h-4 w-4 mr-2" />
                                  <span>Add Star</span>
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 