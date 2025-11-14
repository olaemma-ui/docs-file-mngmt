"use client";

import { useEffect, useMemo, useState } from "react";
import { ShareIcon, Trash2, UserRoundSearch, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useUsersStore } from "@/app/admin/users/store/users.store";
import { useTeamStore } from "@/app/team/store/useTeamStore";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { TeamEntity } from "@/app/team/entities/team.entity";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  fullName: string;
  email: string;
}

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShare: ( payload: { users: string[]; teams: string[] }) => void;
  onCancel?: () => void;
  allowTeams?: boolean;
}

export function ShareDialog({
  open,
  onOpenChange,
  onShare,
  onCancel,
  allowTeams = true,
}: ShareDialogProps) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"users" | "teams">("users");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<TeamEntity[]>([]);

  const { listUsers, users, loading: userLoading } = useUsersStore();
  const { listTeams, teams, loading: teamLoading } = useTeamStore();

  // Fetch users/teams dynamically
  useEffect(() => {
    if (query.trim().length > 1) {
      if (searchType === "users") listUsers({ search: query });
      else listTeams({ search: query });
    }
  }, [query, searchType]);

  // Filter out already selected
  const filteredUsers = useMemo(
    () => users.filter((u) => !selectedUsers.some((su) => su.id === u.id)),
    [users, selectedUsers]
  );

  const filteredTeams = useMemo(
    () => teams.filter((t) => !selectedTeams.some((st) => st.id === t.id)),
    [teams, selectedTeams]
  );

  const handleSelectUser = (user: User) => {
    setSelectedUsers((prev) => [...prev, user]);
    setQuery("");
  };

  const handleSelectTeam = (team: TeamEntity) => {
    setSelectedTeams((prev) => [...prev, team]);
    setQuery("");
  };

  const handleRemoveUser = (id: string) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleRemoveTeam = (id: string) => {
    setSelectedTeams((prev) => prev.filter((t) => t.id !== id));
  };

  const handleConfirmShare = () => {
    onShare({
      users: selectedUsers.map((u) => u.email),
      teams: selectedTeams.map((t) => t.id),
    });
    resetState();
  };

  const handleCancel = () => {
    resetState();
    onCancel?.();
  };

  const resetState = () => {
    setSelectedUsers([]);
    setSelectedTeams([]);
    setQuery("");
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        resetState();
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
          <DialogDescription>
            Search and select users or teams to share with
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Search Bar */}
          <div className="flex gap-2 items-center">
            <Input
              placeholder={`Search ${searchType}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-secondary/50 h-10! border-border/50"
            />
            {allowTeams && (
              <Select
                value={searchType}
                onValueChange={(value: "users" | "teams") =>
                  setSearchType(value)
                }
              >
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="teams">Teams</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Search Results */}
          <div className="border border-border rounded-md max-h-56 overflow-hidden">
            {query.trim().length > 1 && (
              <ScrollArea className="h-56 rounded-2xl">
                <>
                  {searchType === "users" ? (
                    userLoading ? (
                      <p className="text-center py-3 text-muted-foreground text-sm">
                        Loading users...
                      </p>
                    ) : filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleSelectUser(user)}
                          className="w-full cursor-pointer text-left px-4 py-2 hover:bg-accent/10 flex justify-between items-center border-b border-border last:border-0"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {user.fullName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="flex items-center justify-center py-3 h-full">
                        <div className="flex flex-col justify-center h-full items-center">
                          <div className="p-3 rounded-md border">
                            <UserRoundSearch className="w-5 h-5 text-black/20" />
                          </div>
                          <p className="text-sm mt-3">No User Found</p>
                          <p className="text-xs text-black/40">
                            Search User or Team to share with
                          </p>
                        </div>
                      </div>
                    )
                  ) : teamLoading ? (
                    <p className="text-center py-3 text-muted-foreground text-sm">
                      Loading teams...
                    </p>
                  ) : filteredTeams.length > 0 ? (
                    filteredTeams.map((team) => (
                      <button
                        key={team.id}
                        onClick={() => handleSelectTeam(team)}
                        className="w-full text-left px-4 py-2 hover:bg-accent/10 flex justify-between items-center border-b border-border last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium">{team.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {team.members?.length ?? 0} members
                          </p>
                        </div>
                        <Users className="w-4 h-4 text-muted-foreground" />
                      </button>
                    ))
                  ) : (
                    <div className="flex items-center justify-center py-3 h-full">
                      <div className="flex flex-col justify-center h-full items-center">
                        <div className="p-3 rounded-md border">
                          <Users className="w-5 h-5 text-black/20" />
                        </div>
                        <p className="text-sm mt-3">Teams Not Found</p>
                        <p className="text-xs text-black/40">
                          Search User or Team to share with
                        </p>
                      </div>
                    </div>
                  )}
                </>
              </ScrollArea>
            )}
          </div>

          {/* Selected Items */}
          <div className="space-y-3">
            {selectedUsers.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Selected Users ({selectedUsers.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((u) => (
                    <Badge
                      key={u.id}
                      onClick={() => handleRemoveUser(u.id)}
                      variant="outline"
                      className="flex cursor-pointer items-center gap-2 p-2 px-3"
                    >
                      {u.email}
                      <Trash2 className="w-3 h-3 cursor-pointer hover:text-red-500" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedTeams.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Selected Teams ({selectedTeams.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedTeams.map((t) => (
                    <Badge
                      key={t.id}
                      variant="outline"
                      className="flex cursor-pointer items-center gap-2 p-2 px-3"
                      onClick={() => handleRemoveTeam(t.id)}
                    >
                      {t.name}
                      <Trash2 className="w-3 h-3 cursor-pointer hover:text-red-500" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-8 justify-end gap-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            className="col-span-3"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmShare}
            disabled={selectedUsers.length === 0 && selectedTeams.length === 0}
            className="bg-accent hover:bg-accent/90 col-span-5 text-accent-foreground"
          >
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
