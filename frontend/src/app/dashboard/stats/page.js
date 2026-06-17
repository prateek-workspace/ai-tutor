"use client";

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  LineChart,
  PieChart,
  Activity,
  CalendarClock,
  GraduationCap,
  Award,
  ArrowUp,
  ArrowDown
} from "lucide-react";

export default function StatsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
        <p className="text-muted-foreground">
          View your academic performance and learning analytics.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Grade
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.5%</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>4.2% from last semester</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Study Time
            </CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5h</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>2.3h from last week</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assignments Completed
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42/45</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>93.3% completion rate</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Attendance Rate
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95.8%</div>
            <div className="flex items-center text-xs text-red-600">
              <ArrowDown className="h-3 w-3 mr-1" />
              <span>1.2% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="time">Time Analytics</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Grade Distribution</CardTitle>
                  <CardDescription>
                    Your grade breakdown across all subjects
                  </CardDescription>
                </div>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex flex-col items-center justify-center bg-muted/20 rounded-md">
                  <div className="w-40 h-40 rounded-full border-8 border-primary relative flex items-center justify-center">
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full"></div>
                    <div className="absolute top-10 -right-3 w-4 h-4 bg-blue-400 rounded-full"></div>
                    <div className="absolute -bottom-3 right-14 w-4 h-4 bg-yellow-400 rounded-full"></div>
                    <div className="absolute -left-4 top-14 w-4 h-4 bg-green-400 rounded-full"></div>
                    <div className="text-xl font-bold">87.5%</div>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-4 mt-6">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                      <span className="text-sm">A (45%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                      <span className="text-sm">B (30%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                      <span className="text-sm">C (15%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-sm">Other (10%)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Performance Trend</CardTitle>
                  <CardDescription>
                    Your grade trend over time
                  </CardDescription>
                </div>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex flex-col justify-between bg-muted/20 rounded-md p-4">
                  <div className="flex justify-between w-full border-b border-border pb-4">
                    <div className="flex flex-col items-center">
                      <div className="w-16 bg-primary/30 rounded-t-sm" style={{ height: '40px' }}></div>
                      <span className="text-xs mt-1">Jan</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 bg-primary/30 rounded-t-sm" style={{ height: '60px' }}></div>
                      <span className="text-xs mt-1">Feb</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 bg-primary/30 rounded-t-sm" style={{ height: '90px' }}></div>
                      <span className="text-xs mt-1">Mar</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 bg-primary/30 rounded-t-sm" style={{ height: '75px' }}></div>
                      <span className="text-xs mt-1">Apr</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 bg-primary/30 rounded-t-sm" style={{ height: '120px' }}></div>
                      <span className="text-xs mt-1">May</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 bg-primary rounded-t-sm" style={{ height: '150px' }}></div>
                      <span className="text-xs mt-1">Jun</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">+12.4%</div>
                      <p className="text-xs text-muted-foreground">Growth Since January</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">87.5%</div>
                      <p className="text-xs text-muted-foreground">Current Average</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">92%</div>
                      <p className="text-xs text-muted-foreground">Projected End</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance By Category</CardTitle>
              <CardDescription>
                Your performance across different assessment types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Quizzes</h4>
                    <span className="text-sm text-muted-foreground">92%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '92%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Assignments</h4>
                    <span className="text-sm text-muted-foreground">85%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Projects</h4>
                    <span className="text-sm text-muted-foreground">78%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '78%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Exams</h4>
                    <span className="text-sm text-muted-foreground">89%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '89%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Participation</h4>
                    <span className="text-sm text-muted-foreground">95%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subjects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
              <CardDescription>
                Your performance in each subject
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[500px] flex items-center justify-center bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Subject performance chart will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="time" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Time Analytics</CardTitle>
              <CardDescription>
                Analysis of your study time and productivity
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[500px] flex items-center justify-center bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Time analytics chart will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>
                Track your progress toward educational goals
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[500px] flex items-center justify-center bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Progress tracking chart will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 