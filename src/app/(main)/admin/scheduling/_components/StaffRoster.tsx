"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
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
import {
  Plus,
  Edit,
  Clock,
  Calendar,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";

export function StaffRoster() {
  const [selectedWeek, setSelectedWeek] = useState("current");

  // Mock data - replace with real data from API
  const staffShifts = [
    {
      id: "1",
      staffName: "Sarah Johnson",
      role: "Support Worker",
      avatar: "",
      shifts: [
        { day: "Mon", start: "09:00", end: "17:00", status: "scheduled" },
        { day: "Tue", start: "09:00", end: "17:00", status: "scheduled" },
        { day: "Wed", start: null, end: null, status: "off" },
        { day: "Thu", start: "09:00", end: "17:00", status: "scheduled" },
        { day: "Fri", start: "09:00", end: "15:00", status: "scheduled" },
        { day: "Sat", start: null, end: null, status: "off" },
        { day: "Sun", start: null, end: null, status: "off" },
      ],
      totalHours: 32,
    },
    {
      id: "2",
      staffName: "Mike Wilson",
      role: "Coordinator",
      avatar: "",
      shifts: [
        { day: "Mon", start: "08:00", end: "16:00", status: "scheduled" },
        { day: "Tue", start: "08:00", end: "16:00", status: "scheduled" },
        { day: "Wed", start: "08:00", end: "16:00", status: "scheduled" },
        { day: "Thu", start: "08:00", end: "16:00", status: "scheduled" },
        { day: "Fri", start: "08:00", end: "16:00", status: "scheduled" },
        { day: "Sat", start: null, end: null, status: "off" },
        { day: "Sun", start: null, end: null, status: "off" },
      ],
      totalHours: 40,
    },
    {
      id: "3",
      staffName: "Lisa Chen",
      role: "Support Worker",
      avatar: "",
      shifts: [
        { day: "Mon", start: null, end: null, status: "leave" },
        { day: "Tue", start: null, end: null, status: "leave" },
        { day: "Wed", start: "10:00", end: "18:00", status: "scheduled" },
        { day: "Thu", start: "10:00", end: "18:00", status: "scheduled" },
        { day: "Fri", start: "10:00", end: "18:00", status: "scheduled" },
        { day: "Sat", start: "09:00", end: "17:00", status: "scheduled" },
        { day: "Sun", start: "09:00", end: "17:00", status: "scheduled" },
      ],
      totalHours: 28,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-green-100 text-green-800";
      case "off":
        return "bg-gray-100 text-gray-800";
      case "leave":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Select value={selectedWeek} onValueChange={setSelectedWeek}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="previous">Previous Week</SelectItem>
              <SelectItem value="current">This Week</SelectItem>
              <SelectItem value="next">Next Week</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Bulk Edit
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Clock className="h-4 w-4 mr-2" />
            Time Off Requests
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Shift
          </Button>
        </div>
      </div>

      {/* Roster Table */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Roster - {selectedWeek === "current" ? "This Week" : selectedWeek === "previous" ? "Last Week" : "Next Week"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Mon</TableHead>
                <TableHead>Tue</TableHead>
                <TableHead>Wed</TableHead>
                <TableHead>Thu</TableHead>
                <TableHead>Fri</TableHead>
                <TableHead>Sat</TableHead>
                <TableHead>Sun</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffShifts.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={staff.avatar} />
                        <AvatarFallback>{getInitials(staff.staffName)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{staff.staffName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{staff.role}</TableCell>
                  {staff.shifts.map((shift, index) => (
                    <TableCell key={index}>
                      {shift.start && shift.end ? (
                        <div className="text-xs">
                          <div>{shift.start} - {shift.end}</div>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(shift.status)}
                          >
                            {shift.status}
                          </Badge>
                        </div>
                      ) : (
                        <Badge
                          variant="secondary"
                          className={getStatusColor(shift.status)}
                        >
                          {shift.status === "leave" ? "Leave" : "Off"}
                        </Badge>
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <span className="font-medium">{staff.totalHours}h</span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Coverage</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">All shifts covered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leave Requests</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Pending approval</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
