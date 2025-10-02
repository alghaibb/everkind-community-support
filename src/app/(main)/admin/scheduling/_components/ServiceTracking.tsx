"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Clock,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  FileText,
  User,
  Calendar,
} from "lucide-react";

export function ServiceTracking() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);

  // Mock data - replace with real data from API
  const serviceLogs = [
    {
      id: "1",
      participant: "John Smith",
      service: "Personal Care Support",
      staff: "Sarah Johnson",
      date: "2025-10-02",
      startTime: "09:00",
      endTime: "11:00",
      actualHours: 2,
      status: "completed",
      notes: "Assisted with morning routine, bathing, and dressing. Participant was cooperative and engaged well.",
      ndisApproved: true,
    },
    {
      id: "2",
      participant: "Emma Davis",
      service: "Community Access",
      staff: "Mike Wilson",
      date: "2025-10-02",
      startTime: "13:00",
      endTime: null,
      actualHours: null,
      status: "in-progress",
      notes: "",
      ndisApproved: true,
    },
    {
      id: "3",
      participant: "David Brown",
      service: "Home Modifications",
      staff: "Lisa Chen",
      date: "2025-10-03",
      startTime: "10:00",
      endTime: "12:00",
      actualHours: 2,
      status: "completed",
      notes: "Completed assessment of bathroom modifications. Provided recommendations for grab bars and shower chair.",
      ndisApproved: false,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredLogs = serviceLogs.filter((log) => {
    const matchesSearch =
      log.participant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.staff.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || log.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStartService = (logId: string) => {
    // Implement start service logic
    console.log("Starting service:", logId);
  };

  const handleCompleteService = (logId: string) => {
    // Implement complete service logic
    console.log("Completing service:", logId);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search service logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Dialog open={isLogDialogOpen} onOpenChange={setIsLogDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Clock className="h-4 w-4 mr-2" />
                Log Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Log Service Delivery</DialogTitle>
                <DialogDescription>
                  Record details of completed service delivery for NDIS compliance.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="participant" className="text-right">
                    Participant
                  </label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select participant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john-smith">John Smith</SelectItem>
                      <SelectItem value="emma-davis">Emma Davis</SelectItem>
                      <SelectItem value="david-brown">David Brown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="service" className="text-right">
                    Service
                  </label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal-care">Personal Care Support</SelectItem>
                      <SelectItem value="community-access">Community Access</SelectItem>
                      <SelectItem value="home-mod">Home Modifications</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="hours" className="text-right">
                    Hours
                  </label>
                  <Input
                    id="hours"
                    type="number"
                    step="0.5"
                    placeholder="2.0"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <label htmlFor="notes" className="text-right pt-2">
                    Notes
                  </label>
                  <Textarea
                    id="notes"
                    placeholder="Describe the service delivered..."
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={() => setIsLogDialogOpen(false)}>
                  Save Service Log
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Service Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Delivery Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participant</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>NDIS</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="font-medium">{log.participant}</div>
                  </TableCell>
                  <TableCell>{log.service}</TableCell>
                  <TableCell>{log.staff}</TableCell>
                  <TableCell>{log.date}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{log.startTime}</div>
                      {log.endTime && <div className="text-muted-foreground">to {log.endTime}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {log.actualHours ? `${log.actualHours}h` : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(log.status)}
                    >
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {log.ndisApproved ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {log.status === "pending" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStartService(log.id)}
                        >
                          <PlayCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {log.status === "in-progress" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCompleteService(log.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredLogs.length}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredLogs.filter((log) => log.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">Services delivered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredLogs
                .filter((log) => log.actualHours)
                .reduce((total, log) => total + (log.actualHours || 0), 0)
              }h
            </div>
            <p className="text-xs text-muted-foreground">Delivered this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NDIS Approved</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredLogs.filter((log) => log.ndisApproved).length}
            </div>
            <p className="text-xs text-muted-foreground">Approved services</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
