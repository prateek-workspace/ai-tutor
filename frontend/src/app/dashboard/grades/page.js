'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUp, ArrowDown, GraduationCap, CalendarClock, Award, Activity, PieChart, LineChart } from "lucide-react";

export default function ResultPage() {
  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <header className="shadow-lg p-4 rounded-lg">
        <h1 className="text-3xl font-bold">Student Results & Feedback</h1>
        <p className="text-muted-foreground">
          View your performance, teacher feedback, and competitive leaderboards.
        </p>
      </header>
      
      {/* Personal Result Cards */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.3%</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>+3.1% from last semester</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35h</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>+5h from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Assignments Completed</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18/20</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>90% completion</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>+2% from previous period</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="results" className="space-y-4">
        <TabsList className="overflow-x-auto whitespace-nowrap">
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>
        
        {/* Results Tab */}
        <TabsContent value="results" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {/* Grade Distribution Chart */}
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Grade Distribution</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="h-60 sm:h-48 flex flex-col items-center justify-center bg-muted/20 rounded-md">
                  <div className="w-32 h-32 rounded-full border-8 border-primary relative flex items-center justify-center">
                    <div className="text-xl font-bold">92%</div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 mt-6">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                      <span className="text-sm">A: 55%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                      <span className="text-sm">B: 30%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                      <span className="text-sm">C: 10%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-sm">D/F: 5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Performance Trend Chart */}
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Performance Trend</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="h-60 sm:h-48 flex flex-col justify-between bg-muted/20 rounded-md p-4">
                  <div className="flex justify-between w-full border-b border-border pb-4">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div className="w-12 bg-primary/30 rounded-t-sm" style={{ height: `${40 + idx * 10}px` }}></div>
                        <span className="text-xs mt-1">{month}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">+8%</div>
                      <p className="text-xs text-muted-foreground">Growth since Jan</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">91%</div>
                      <p className="text-xs text-muted-foreground">Current Average</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">95%</div>
                      <p className="text-xs text-muted-foreground">Projected End</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-4">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Teacher Feedback</CardTitle>
                <CardDescription>Personalized comments from your instructors</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  "Excellent analytical skills and consistent performance throughout the semester. Keep up the great work!"
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="Teacher Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-xs text-gray-500">Ms. Thompson</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Peer Feedback</CardTitle>
                <CardDescription>What your classmates say</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  "Your project presentation was top-notch and really inspired the class to aim higher."
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Peer Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-xs text-gray-500">John Doe</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Competitive Leaderboard</CardTitle>
              <CardDescription>Top performers in your course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  {
                    rank: 1,
                    name: "Alex Johnson",
                    average: "95%",
                    trend: "+4%",
                    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
                    trendColor: "text-green-600",
                  },
                  {
                    rank: 2,
                    name: "Emily Smith",
                    average: "93%",
                    trend: "+3%",
                    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
                    trendColor: "text-green-600",
                  },
                  {
                    rank: 3,
                    name: "Michael Brown",
                    average: "90%",
                    trend: "-2%",
                    avatar: "https://randomuser.me/api/portraits/men/15.jpg",
                    trendColor: "text-red-600",
                  },
                  {
                    rank: 4,
                    name: "Sophia Williams",
                    average: "88%",
                    trend: "+1%",
                    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
                    trendColor: "text-green-600",
                  },
                ].map((student, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2rounded-md">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-bold">{student.rank}.</span>
                      <img
                        src={student.avatar}
                        alt="Student Avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">{student.name}</p>
                        <p className="text-xs text-muted-foreground">Average: {student.average}</p>
                      </div>
                    </div>
                    <div className={`flex items-center ${student.trendColor}`}>
                      {student.trend.startsWith('+') ? (
                        <ArrowUp className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 mr-1" />
                      )}
                      <span className="font-semibold">{student.trend}</span>
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
