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
  FileText, 
  Upload, 
  Check, 
  AlertTriangle, 
  Clock, 
  Search,
  RefreshCw,
  Copy,
  Download,
  History,
  ListFilter,
  FileUp,
  Eye
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PlagiarismPage() {
  const [text, setText] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedTab, setSelectedTab] = useState("check");
  
  const previousChecks = [
    {
      id: 1,
      title: "Literary Analysis Essay",
      date: "2023-06-10",
      status: "completed",
      similarity: 12.3,
      wordCount: 1542,
      sources: 3
    },
    {
      id: 2,
      title: "Research Paper - Renewable Energy",
      date: "2023-05-28",
      status: "completed",
      similarity: 5.7,
      wordCount: 2354,
      sources: 1
    },
    {
      id: 3,
      title: "Psychology Case Study",
      date: "2023-05-15",
      status: "completed",
      similarity: 0,
      wordCount: 980,
      sources: 0
    },
    {
      id: 4,
      title: "History Essay - World War II",
      date: "2023-04-22",
      status: "completed",
      similarity: 18.9,
      wordCount: 1845,
      sources: 5
    }
  ];
  
  const matchedSources = [
    {
      id: 1,
      title: "Introduction to Literary Theory",
      url: "https://example.com/literary-theory",
      similarity: 32.5,
      matchedText: "The concept of postmodernism emerged in the late 20th century as a response to modernism, characterized by skepticism, irony, and the rejection of grand narratives."
    },
    {
      id: 2,
      title: "Postmodern Literature: A Critical Analysis",
      url: "https://example.com/postmodern-literature",
      similarity: 24.8,
      matchedText: "Postmodern literature is characterized by its use of fragmentation, paradox, and unreliable narrators. It challenges established boundaries and questions objective truth."
    },
    {
      id: 3,
      title: "Contemporary Literary Criticism",
      url: "https://example.com/literary-criticism",
      similarity: 18.3,
      matchedText: "The rejection of grand narratives and the embrace of pluralism are hallmarks of postmodern thought, influencing literature throughout the late 20th century."
    }
  ];
  
  const handleCheckPlagiarism = () => {
    if (!text.trim()) return;
    
    setIsChecking(true);
    
    // Simulate API call
    setTimeout(() => {
      setResults({
        similarity: 12.3,
        wordCount: text.split(/\s+/).filter(Boolean).length,
        sources: matchedSources.length,
        matchedSources: matchedSources,
        checkDate: new Date().toISOString()
      });
      
      setIsChecking(false);
      setSelectedTab("results");
    }, 2000);
  };
  
  const getSimilarityColor = (percentage) => {
    if (percentage < 10) return "text-green-600";
    if (percentage < 20) return "text-amber-600";
    return "text-red-600";
  };
  
  const getSimilarityBadge = (percentage) => {
    if (percentage < 10) {
      return <Badge className="bg-green-50 text-green-700 border-green-200">Low Similarity</Badge>;
    } else if (percentage < 20) {
      return <Badge className="bg-amber-50 text-amber-700 border-amber-200">Moderate Similarity</Badge>;
    } else {
      return <Badge className="bg-red-50 text-red-700 border-red-200">High Similarity</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Plagiarism Checker</h1>
        <p className="text-muted-foreground">
          Check your work for plagiarism before submission.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Documents Checked
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{previousChecks.length}</div>
            <p className="text-xs text-muted-foreground">
              This semester
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Similarity
            </CardTitle>
            <Copy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(previousChecks.reduce((sum, item) => sum + item.similarity, 0) / previousChecks.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across all checked documents
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Remaining Checks
            </CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Monthly quota
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Last Check
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 days ago</div>
            <p className="text-xs text-muted-foreground">
              {previousChecks[0].title}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="check">Check Document</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="tips">Writing Tips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="check" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Check for Plagiarism</CardTitle>
              <CardDescription>
                Paste your text or upload a document to check for plagiarism
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="document-title">Document Title</Label>
                <Input id="document-title" placeholder="Enter a title for your document" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="document-text">Document Text</Label>
                  <span className="text-xs text-muted-foreground">
                    {text.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
                <Textarea 
                  id="document-text" 
                  placeholder="Paste your text here..." 
                  className="min-h-[200px]"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Or upload a document:
                </div>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between mb-2">
                  <h3 className="text-sm font-medium">Checking Options</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="check-type">Check Type</Label>
                    <Select defaultValue="standard">
                      <SelectTrigger id="check-type">
                        <SelectValue placeholder="Select check type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard Check</SelectItem>
                        <SelectItem value="deep">Deep Analysis</SelectItem>
                        <SelectItem value="quick">Quick Scan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="document-type">Document Type</Label>
                    <Select defaultValue="essay">
                      <SelectTrigger id="document-type">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="essay">Essay</SelectItem>
                        <SelectItem value="research">Research Paper</SelectItem>
                        <SelectItem value="report">Report</SelectItem>
                        <SelectItem value="thesis">Thesis/Dissertation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setText("")}>Clear Text</Button>
              <Button 
                onClick={handleCheckPlagiarism} 
                disabled={!text.trim() || isChecking}
              >
                {isChecking ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Check Plagiarism
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="results" className="space-y-4">
          {results ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Plagiarism Results</CardTitle>
                      <CardDescription>
                        Analysis completed on {new Date(results.checkDate).toLocaleString()}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold mb-2 flex items-baseline">
                        <span className={getSimilarityColor(results.similarity)}>
                          {results.similarity}%
                        </span>
                      </div>
                      <p className="text-sm text-center text-muted-foreground">Similarity Score</p>
                      <div className="mt-2">
                        {getSimilarityBadge(results.similarity)}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold mb-2">
                        {results.wordCount}
                      </div>
                      <p className="text-sm text-center text-muted-foreground">Word Count</p>
                    </div>
                    
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold mb-2">
                        {results.sources}
                      </div>
                      <p className="text-sm text-center text-muted-foreground">Matched Sources</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Content Originality</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Original Content</span>
                        <span className="font-medium">{(100 - results.similarity).toFixed(1)}%</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: `${100 - results.similarity}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Similar Content</span>
                        <span className="font-medium">{results.similarity}%</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: `${results.similarity}%` }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Matched Sources</h3>
                    
                    {results.matchedSources.map((source) => (
                      <div key={source.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{source.title}</h4>
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {source.url}
                            </a>
                          </div>
                          <Badge 
                            className={`${
                              source.similarity > 30 
                                ? "bg-red-50 text-red-700 border-red-200" 
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {source.similarity}% Similar
                          </Badge>
                        </div>
                        
                        <div className="p-3 bg-muted/30 rounded text-sm italic">
                          "{source.matchedText}"
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setSelectedTab("check")}>
                    Check Another Document
                  </Button>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Text Analysis
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>Based on your document analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                      </div>
                      
                      <div>
                        <h3 className="font-medium">Review Matched Sources</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Examine the matched content and consider rewriting these sections in your own words.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      
                      <div>
                        <h3 className="font-medium">Add Proper Citations</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ensure all borrowed ideas, concepts, and quotes are properly cited according to your required citation style.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      
                      <div>
                        <h3 className="font-medium">Use Quotation Marks</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Place direct quotes in quotation marks and include proper attribution to the original source.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-[300px]">
                <Search className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Results Available</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  You haven't checked any document for plagiarism yet. Go to the "Check Document" tab to analyze your work.
                </p>
                <Button className="mt-4" onClick={() => setSelectedTab("check")}>
                  Check Document
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Check History</CardTitle>
                  <CardDescription>
                    Previous plagiarism checks and their results
                  </CardDescription>
                </div>
                
                <Select defaultValue="all">
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Checks</SelectItem>
                    <SelectItem value="high">High Similarity</SelectItem>
                    <SelectItem value="moderate">Moderate Similarity</SelectItem>
                    <SelectItem value="low">Low Similarity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {previousChecks.map((check) => (
                  <div key={check.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className={`bg-primary/10 p-2 rounded-full ${
                      check.similarity < 10 
                        ? "text-green-600" 
                        : check.similarity < 20 
                          ? "text-amber-600" 
                          : "text-red-600"
                    }`}>
                      <FileText className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{check.title}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <History className="h-3 w-3 mr-1" />
                            <span>{check.date}</span>
                            <span className="mx-1">•</span>
                            <span>{check.wordCount} words</span>
                          </div>
                        </div>
                        <div>
                          {getSimilarityBadge(check.similarity)}
                        </div>
                      </div>
                      
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Similarity</span>
                          <span className={getSimilarityColor(check.similarity)}>{check.similarity}%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              check.similarity < 10 
                                ? "bg-green-500" 
                                : check.similarity < 20 
                                  ? "bg-amber-500" 
                                  : "bg-red-500"
                            }`} 
                            style={{ width: `${check.similarity}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      View Results
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Integrity Tips</CardTitle>
              <CardDescription>
                Guidelines to help you maintain academic integrity in your work
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Proper Citation Guidelines</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Always cite your sources properly using the required citation style (APA, MLA, Chicago, etc.). Include citations for direct quotes, paraphrased content, and borrowed ideas.
                    </p>
                    <Button variant="link" className="px-0 text-sm h-auto">
                      View Citation Guide
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Paraphrasing Effectively</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      When paraphrasing, make sure to completely restate the original idea in your own words. Simply changing a few words or rearranging sentences is still considered plagiarism.
                    </p>
                    <Button variant="link" className="px-0 text-sm h-auto">
                      Paraphrasing Techniques
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Use Quotation Marks</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Always use quotation marks for direct quotes, even short phrases taken verbatim from a source. Follow the quotation with a proper citation.
                    </p>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Keep Track of Sources</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Maintain a detailed record of all sources used during your research process. Include full bibliographic information to make citation easier later.
                    </p>
                    <Button variant="link" className="px-0 text-sm h-auto">
                      Download Source Tracker Template
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Consequences of Plagiarism</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Understand that plagiarism can result in serious consequences, including course failure, academic probation, or even expulsion. Maintaining academic integrity is essential to your educational journey.
                    </p>
                    <Button variant="link" className="px-0 text-sm h-auto">
                      University Plagiarism Policy
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 