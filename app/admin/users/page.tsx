"use client";

import { useEffect, useState } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  MoreVertical,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2,
  Edit,
  Lock,
  Unlock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { AddUserModal } from "@/components/modals/add-user-modal";
import { UserDetailsModal } from "@/components/modals/user-details-modal";
import { toast } from "sonner";
import { useUsersStore } from "./store/users.store";
import { AccountStatus, UserRoles } from "@/core/enums/users.enums";
import { CreateUserPayload } from "./dto/create-user.dto";

const roleColors = {
  [UserRoles.SUPER_ADMIN]: "bg-red-500/10 text-red-700 dark:text-red-400",
  [UserRoles.ADMIN]: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  [UserRoles.USER]: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
};

const statusColors = {
  [AccountStatus.ACTIVE]: "bg-green-500/10 text-green-700 dark:text-green-400",
  [AccountStatus.BLACKLISTED]:
    "bg-gray-500/10 text-gray-700 dark:text-gray-400",
  [AccountStatus.PENDING]:
    "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
};

export default function UsersPage() {
  const {
    users,
    loading,
    creating,
    updating,
    deleting,
    listUsers,
    createUser,
    updateUser,
    deleteUser,
  } = useUsersStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // ✅ Fetch users on mount
  useEffect(() => {
    listUsers({
      page: 1,
      limit: 20,
    }).catch(() => {
      toast.error("Failed to fetch users");
    });
  }, [listUsers]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // ✅ Handle creating user via API
  const handleAddUser = async (user: CreateUserPayload) => {
    console.log({ user });
    const result = await createUser(user);
    if (!result?.hasError) {
      toast.success("User created successfully");
      setIsAddUserModalOpen(false);
    } else {
      toast.error(result?.message ?? "Failed to create user");
    }
  };

  // ✅ Handle delete
  const handleDeleteUser = async (id: string) => {
    // const result = await deleteUser(id);
    // if (result?.success) toast.success("User deleted");
    // else toast.error(result?.message ?? "Failed to delete user");
  };

  // ✅ Handle update (edit modal)
  const handleUpdateUser = async (id: string, payload: Record<string, any>) => {
    // const result = await updateUser(id, payload);
    // if (result?.success) toast.success("User updated");
    // else toast.error(result?.message ?? "Failed to update user");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="px-4 md:px-8 py-4 md:py-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-mono font-semibold text-foreground">
                User Management
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage users, roles, permissions, and access control
              </p>
            </div>
            <Button
              onClick={() => setIsAddUserModalOpen(true)}
              className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={creating}
            >
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-4 md:p-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-mono font-semibold mt-1">
                {users.length}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-mono font-semibold mt-1">
                {users.filter((u) => u.status === AccountStatus.ACTIVE).length}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-mono font-semibold mt-1">
                {users.filter((u) => u.status === AccountStatus.PENDING).length}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Blacklisted</p>
              <p className="text-2xl font-mono font-semibold mt-1">
                {
                  users.filter((u) => u.status === AccountStatus.BLACKLISTED)
                    .length
                }
              </p>
            </Card>
          </div>

          {/* Search & Filters */}
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-0 focus-visible:ring-0 placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {[UserRoles.ADMIN, UserRoles.USER].map((r) => (
                  <Button
                    key={r}
                    variant={filterRole === r ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterRole(r)}
                  >
                    {r}
                  </Button>
                ))}
                {["all", "active", "pending"].map((s) => (
                  <Button
                    key={s}
                    variant={filterStatus === s ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus(s)}
                  >
                    {s === "all"
                      ? "All Status"
                      : s.charAt(0).toUpperCase() + s.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {/* Table */}
          <Card className="border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-3 text-left">User</th>
                    <th className="px-6 py-3 text-left">Role</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Loading users...
                      </td>
                    </tr>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-border hover:bg-muted/30"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">{user.fullName}</p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            className={`${roleColors[user.role!]} border-0`}
                          >
                            {user.role ?? "-"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            className={`${statusColors[user.status!]} border-0`}
                          >
                            {user.status ?? "-"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsUserDetailsModalOpen(true);
                                }}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>

      {/* Modals */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        loading={creating}
        onClose={() => setIsAddUserModalOpen(false)}
        onAddUser={handleAddUser}
      />

      {selectedUser && (
        <UserDetailsModal
          isOpen={isUserDetailsModalOpen}
          onClose={() => {
            setIsUserDetailsModalOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          onUpdateUser={(updatedUser) =>
            handleUpdateUser(updatedUser.id, updatedUser)
          }
        />
      )}
    </div>
  );
}
