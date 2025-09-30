"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminUser } from "@/types/admin";
import {
  Eye,
  MoreHorizontal,
  Shield,
  User,
  Home,
  Building,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  UserX,
  LogOut,
  Mail,
  MailCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal";
import { MODAL_TYPES } from "@/app/(main)/admin/constants";
import { useToggleEmailVerification } from "@/lib/mutations/admin-mutations";

interface UsersTableProps {
  users: AdminUser[];
}

export function UsersTable({ users }: UsersTableProps) {
  const { onOpen } = useModal();
  const toggleEmailVerificationMutation = useToggleEmailVerification();

  const handleDeleteUser = (user: AdminUser) => {
    onOpen(MODAL_TYPES.DELETE_USER, { user });
  };

  const handleBanUser = (user: AdminUser) => {
    onOpen(MODAL_TYPES.BAN_USER, { user });
  };

  const handleRevokeUserSessions = (user: AdminUser) => {
    onOpen(MODAL_TYPES.REVOKE_SESSIONS, { user });
  };

  const handleToggleEmailVerification = (userId: string) => {
    toggleEmailVerificationMutation.mutate(userId);
  };

  const canManageUser = (user: AdminUser) => {
    // Cannot manage other admins
    return !(user.role === "ADMIN" && user.userType === "INTERNAL");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatLastActive = (lastActive: string | null) => {
    if (!lastActive) return "Never";

    const date = new Date(lastActive);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;

    return date.toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRoleIcon = (role: string | null) => {
    if (role === "ADMIN") return <Shield className="h-4 w-4" />;
    if (role === "STAFF") return <User className="h-4 w-4" />;
    return <User className="h-4 w-4" />;
  };

  const getUserTypeIcon = (userType: string) => {
    if (userType === "INTERNAL") return <Building className="h-4 w-4" />;
    return <Home className="h-4 w-4" />;
  };

  const getRoleBadgeVariant = (role: string | null) => {
    if (role === "ADMIN") return "destructive";
    if (role === "STAFF") return "default";
    return "secondary";
  };

  const getUserTypeBadgeVariant = (userType: string) => {
    if (userType === "INTERNAL") return "default";
    return "outline";
  };

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No users found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Users ({users.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Member Since</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                      {user.additionalInfo?.phone && (
                        <div className="text-sm text-muted-foreground">
                          {user.additionalInfo.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={getRoleBadgeVariant(user.role || null)}
                      className="gap-1"
                    >
                      {getRoleIcon(user.role || null)}
                      {user.role || "N/A"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={getUserTypeBadgeVariant(user.userType || "")}
                      className="gap-1"
                    >
                      {getUserTypeIcon(user.userType || "")}
                      {user.userType}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={user.isActive ? "default" : "secondary"}
                      className="gap-1"
                    >
                      {user.isActive ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {formatLastActive(user.lastActive)}
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            onOpen(MODAL_TYPES.VIEW_USER, { user })
                          }
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>

                        {canManageUser(user) && (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                onOpen(MODAL_TYPES.EDIT_USER, { user })
                              }
                              className="cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                handleToggleEmailVerification(user.id)
                              }
                              className="cursor-pointer"
                              disabled={
                                toggleEmailVerificationMutation.isPending
                              }
                            >
                              {user.emailVerified ? (
                                <Mail className="mr-2 h-4 w-4" />
                              ) : (
                                <MailCheck className="mr-2 h-4 w-4" />
                              )}
                              {user.emailVerified
                                ? "Unverify Email"
                                : "Verify Email"}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => handleRevokeUserSessions(user)}
                              className="cursor-pointer"
                            >
                              <LogOut className="mr-2 h-4 w-4" />
                              Revoke Sessions
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleBanUser(user)}
                              className="cursor-pointer text-orange-600 hover:text-orange-700"
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Ban User
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => handleDeleteUser(user)}
                              className="cursor-pointer text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
