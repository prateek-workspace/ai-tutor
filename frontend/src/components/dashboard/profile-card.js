import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Briefcase } from "lucide-react";

export function ProfileCard() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4 pb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="https://i.pravatar.cc/150?u=john.doe" alt="Profile" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="space-y-1 text-center">
            <h3 className="font-medium text-lg">John Doe</h3>
            <p className="text-sm text-muted-foreground">Student</p>
          </div>
        </div>
        
        <div className="space-y-4 pt-2">
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">john.doe@example.com</span>
          </div>
          <div className="flex items-center">
            <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">Computer Science</span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">Active since Jan 2023</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 px-6 py-3">
        <Link href="/dashboard/profile" className="w-full">
          <Button variant="outline" className="w-full">View Full Profile</Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 