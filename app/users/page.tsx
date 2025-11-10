"use client";

import { useEffect } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import { Plus, MoreVertical, Mail, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUsersStore } from "../admin/users/store/users.store";
import { AccountStatus } from "@/core/enums/users.enums";


const roleColors: Record<string, string> = {
  Admin: "bg-red-500/10 text-red-700",
  Editor: "bg-blue-500/10 text-blue-700",
  Viewer: "bg-gray-500/10 text-gray-700",
};

export default function UsersPage() {
  const { users, loading, error, listUsers } = useUsersStore();

  useEffect(() => {
    listUsers();
  }, [listUsers]);

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />

      <main className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="px-4 md:px-8 py-4 md:py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-mono font-semibold text-foreground">
                  Users
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage team members and permissions
                </p>
              </div>
              <Button className="gap-2 bg-accent hover:bg-accent/90">
                <Plus className="w-4 h-4" />
                Add User
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">
                Loading users...
              </span>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-20">
              Failed to load users: {error}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center text-muted-foreground py-20">
              No users found.
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user, index) => (
                <Card
                  key={user.id}
                  className="p-4 hover:border-accent/50 transition-all group"
                  style={{
                    animation: `fadeInUp 0.5s ease-out`,
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar>
                        <AvatarFallback>
                          {user.fullName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-mono font-semibold text-foreground">
                          {user.fullName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        className={
                          roleColors[user.role || "Viewer"] ||
                          "bg-gray-500/10 text-gray-700"
                        }
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        {user.role || "Viewer"}
                      </Badge>
                      <Badge
                        variant={
                          user.status === AccountStatus.ACTIVE ? "default" : "secondary"
                        }
                      >
                        {user.status ?? "--"}
                      </Badge>
                      {/* <span className="text-sm text-muted-foreground">
                        {new Date(user.createdAt || "").toLocaleDateString() ||
                          "—"}
                      </span> */}
                      <button className="p-2 rounded-lg hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
