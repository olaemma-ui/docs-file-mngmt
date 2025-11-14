"use client";

import { useEffect, useState } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import { Button } from "@/components/ui/button";
import {
  Users,
  Plus,
  Trash2,
  UserCheck,
  Check,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import { TeamEntity } from "./entities/team.entity";
import { useTeamStore } from "./store/useTeamStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUsersStore } from "../admin/users/store/users.store";
import { UserEntity } from "../admin/users/entities/user.entity";
import { useAuthStore } from "../auth/store/auth.store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function TeamsPage() {
  const {
    teams,
    getMyTeam,
    getTeam,
    selectedTeam,
    deleteTeamMember,
    inviteMembers,
    loading,
    createTeam,
  } = useTeamStore();

  const { user } = useAuthStore();
  const { users, listUsers } = useUsersStore();

  const [showOverlay, setShowOverlay] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [teamName, setTeamName] = useState("");
  const [teamDesc, setTeamDesc] = useState("");
  const [teamUsers, setTeamUsers] = useState<UserEntity[]>([]);
  const [newTeamUsers, setNewTeamUsers] = useState<UserEntity[]>([]);
  const [searchUserQuery, setSearchUserQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  // const [inviteSearchQuery, setInviteSearchQuery] = useState("");
  const [inviteResults, setInviteResults] = useState<UserEntity[]>([]);
  const [selectedInviteUsers, setSelectedInviteUsers] = useState<UserEntity[]>(
    []
  );

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (searchUserQuery.trim().length > 1) {
        await listUsers({ search: searchUserQuery });
        setShowResults(true);
      } else {
        setShowResults(false);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [searchUserQuery]);

  // When overlay opens, reset invite search
  useEffect(() => {
    if (!showOverlay) {
      setSearchUserQuery("");
      setInviteResults([]);
      setNewTeamUsers([]);
    }
  }, [showOverlay]);

  useEffect(() => {
    getMyTeam({ page: currentPage, pageSize });
  }, [currentPage]);

  const paginatedTeams = teams.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleTeamClick = async (teamId: string) => {
    await getTeam(teamId);
    setShowOverlay(true);
  };

  const handleRemoveMember = async (userId: string) => {
    if (!selectedTeam) return;
    await deleteTeamMember(selectedTeam.id, userId);
  };

  const handleInviteMember = async () => {
    if (!selectedTeam) return;
    await inviteMembers(
      selectedTeam.id,
      selectedInviteUsers.map((user) => user.email),
      "MEMBER"
    );
    getTeam(selectedTeam.id);
  };

  const handleCreateTeam = async () => {
    if (!teamName || teamUsers.length === 0) return;
    await createTeam({
      name: teamName,
      description: teamDesc,
      members: teamUsers.map((u) => u.email),
    });
    setTeamName("");
    setTeamDesc("");
    setTeamUsers([]);
    setNewTeamUsers([]);
    setShowCreateDialog(false);
    getMyTeam({ page: currentPage, pageSize });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1 md:ml-64 transition-all duration-300 p-6">
        {/* Header */}
        <header className="sticky pb-4 mb-5 top-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-2xl md:text-3xl font-mono font-semibold text-foreground">
                  My Team
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Create, manage, and share folders accross teams.
                </p>
              </div>

              <Button
                className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="w-4 h-4" /> Create Team
              </Button>
            </div>
          </div>
        </header>
        {/* Empty State */}
        {teams.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center text-muted-foreground">
            <Users className="w-12 h-12 mb-4" />
            <p>No teams found. Create your first team!</p>
          </div>
        ) : (
          <div className="border rounded-2xl p-6">
            {/* Pagination */}
            <div className="flex mb-6 md:grid-cols-12 items-center md:gap-4 gap-2">
              <Input
                placeholder="Search users..."
                // value={searchUserQuery}
                // onChange={(e) => setSearchUserQuery(e.target.value)}
                className="col-span-9 m-0!"
              />
              <div className="flex col-span-3 max-w-[300px] justify-between gap-2 rounded-lg border p-1 items-center w-full">
                <Button
                  disabled={currentPage === 1}
                  variant={`${currentPage === 1 ? "outline" : "default"}`}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-black/60">
                  Page {currentPage} of {Math.ceil(teams.length / pageSize)}
                </span>
                <Button
                  variant={`${
                    currentPage * pageSize >= teams.length
                      ? "outline"
                      : "default"
                  }`}
                  disabled={currentPage * pageSize >= teams.length}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
            {/* Teams Table */}
            <div className="space-y-6 w-full">
              <div className="rounded-lg border border-border overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-muted border-b border-border text-sm font-semibold text-muted-foreground">
                  <div className="col-span-4">Name</div>
                  <div className="col-span-3">Description</div>
                  <div className="col-span-2">Creator</div>
                  <div className="col-span-1">Members</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-border">
                  {paginatedTeams.length > 0 ? (
                    paginatedTeams.map((team, index) => (
                      <motion.div
                        key={team.id}
                        className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-accent/5 transition-colors cursor-pointer"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        style={{
                          animationDelay: `${index * 50}ms`,
                          animationFillMode: "both",
                        }}
                        onClick={() => handleTeamClick(team.id)}
                      >
                        <div className="col-span-4 font-medium text-foreground truncate">
                          {team.name}
                        </div>
                        <div className="col-span-3 text-sm text-muted-foreground truncate">
                          {team.description}
                        </div>
                        <div className="col-span-2 text-sm text-muted-foreground">
                          {team.creator?.fullName}
                        </div>
                        <div className="col-span-1 text-sm text-muted-foreground">
                          {team.members?.length ?? 0}
                        </div>
                        <div className="col-span-2 flex justify-end gap-2">
                          {team.creator && (
                            <UserCheck className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="px-6 py-12 text-center col-span-full">
                      <p className="text-muted-foreground">No teams found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Team Details Overlay */}
      <AnimatePresence>
        {showOverlay && selectedTeam && (
          <motion.div className="fixed top-0 right-0 h-full w-screen bg-black/80 z-20 overflow-y-auto">
            <motion.div
              className="fixed top-0 right-0 h-full md:w-1/2 bg-background shadow-lg z-50 overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="p-6 flex justify-between items-start border-b border-border/50">
                <div>
                  <h2 className="text-xl font-mono font-semibold text-foreground">
                    {selectedTeam.name}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedTeam.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Created By: {selectedTeam.creator?.fullName} |{" "}
                    {format(
                      new Date(selectedTeam.createdAt ?? new Date()),
                      "PPP"
                    )}
                  </p>
                </div>
                <Button onClick={() => setShowOverlay(false)}>Close</Button>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-mono font-semibold text-foreground mb-4">
                  Members
                </h3>
                <div className="space-y-4">
                  {selectedTeam.members?.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 border border-border/30 rounded-md"
                    >
                      <div className="flex gap-4 items-start">
                        <Avatar className="w-[50px] h-[50px] bg-secondary-foreground">
                          <AvatarFallback>
                            {member.user.fullName[0]}
                            {member.user.fullName[1]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="w-full">
                          {member.user.fullName}{" "}
                          <small className="block"> {member.user.email} </small>
                        </span>
                      </div>
                      {selectedTeam.creator?.id === user?.id ? null : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive border-destructive/20"
                          onClick={() => handleRemoveMember(member.user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Invite Members (only if current user is creator) */}
                {selectedTeam.creator?.id === user?.id && (
                  <div className="mt-6 relative flex flex-col">
                    <h4 className="font-mono font-semibold text-foreground mb-2">
                      Invite Members
                    </h4>
                    <Input
                      placeholder="Search users..."
                      value={searchUserQuery}
                      onChange={(e) => setSearchUserQuery(e.target.value)}
                      className="mb-2"
                    />

                    {showResults && users.length > 0 && (
                      <div className="absolute bg-background p-5 border shadow-sm rounded-2xl w-full mt-24 z-100 max-h-48 overflow-y-auto space-y-2 mb-2 transition-all duration-300">
                        {users.map((u) => (
                          <div
                            key={u.id}
                            className="p-3 border rounded-xl cursor-pointer flex justify-between items-center hover:bg-primary/10 transition-all duration-300"
                            onClick={() => {
                              setSelectedInviteUsers([
                                ...selectedInviteUsers,
                                u,
                              ]);
                              setSearchUserQuery("");
                            }}
                          >
                            <div className="flex gap-4 items-start">
                              <Avatar className="w-[50px] h-[50px] bg-secondary-foreground">
                                <AvatarFallback>
                                  {u.fullName[0]}
                                  {u.fullName[1]}
                                </AvatarFallback>
                              </Avatar>
                              <span className="w-full">
                                {u.fullName}{" "}
                                <small className="block"> {u.email} </small>
                              </span>
                            </div>

                            {selectedInviteUsers.includes(u) && (
                              <CheckCircle className="w-6 h-6 text-primary" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedInviteUsers.length > 0 && (
                      <div className="max-h-48 mt-5 overflow-y-auto space-y-2 mb-2">
                        <h5 className="font-semibold">Selected Users</h5>
                        {selectedInviteUsers.map((u) =>
                          teamUsers.map(
                            (team) =>
                              team.id != u.id && (
                                <div
                                  key={u.id}
                                  className="p-3 border rounded-xl cursor-pointer flex justify-between items-center hover:bg-primary/10 transition-all duration-300"
                                  onClick={() =>
                                    setSelectedInviteUsers(
                                      selectedInviteUsers.filter(
                                        (x) => x.id !== u.id
                                      )
                                    )
                                  }
                                >
                                  <div className="flex gap-4 items-start">
                                    <Avatar className="w-[50px] h-[50px] bg-secondary-foreground">
                                      <AvatarFallback>
                                        {u.fullName[0]}
                                        {u.fullName[1]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="w-full">
                                      {u.fullName}{" "}
                                      <small className="block">
                                        {" "}
                                        {u.email}{" "}
                                      </small>
                                    </span>
                                  </div>
                                  <Trash2 className="w-4 h-4 text-red-500 mr-4" />
                                </div>
                              )
                          )
                        )}
                      </div>
                    )}

                    {/* Invite button */}
                    {selectedInviteUsers.length > 0 && (
                      <div className="mt-2 flex justify-end">
                        <Button
                          className="bg-accent text-accent-foreground"
                          onClick={() => handleInviteMember()}
                        >
                          Invite {selectedInviteUsers.length} Member
                          {selectedInviteUsers.length > 1 ? "s" : ""}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Team Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Team</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <Input
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <Textarea
              placeholder="Team Description"
              value={teamDesc}
              onChange={(e) => setTeamDesc(e.target.value)}
              className="mb-2"
            />
            <Input
              placeholder="Search users..."
              value={searchUserQuery}
              onChange={(e) => setSearchUserQuery(e.target.value)}
              className="mb-2"
            />

            {showResults && (
              <div className="max-h-48 overflow-y-auto space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className={`p-2 border rounded-md cursor-pointer flex justify-between items-center ${
                      teamUsers.includes(user)
                        ? "bg-accent/20"
                        : "bg-background"
                    }`}
                    onClick={() =>
                      teamUsers.includes(user)
                        ? setTeamUsers(teamUsers.filter((u) => u !== user))
                        : setTeamUsers([...teamUsers, user])
                    }
                  >
                    <span>
                      {user.fullName} ({user.email})
                    </span>
                    {teamUsers.includes(user) && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {teamUsers.length > 0 && (
              <div className="max-h-48 overflow-y-auto space-y-2 mt-3">
                <h3 className="text-primary">Selected Members</h3>
                {teamUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-2 border rounded-md cursor-pointer flex justify-between items-center bg-accent/20"
                    onClick={() =>
                      setTeamUsers(teamUsers.filter((u) => u !== user))
                    }
                  >
                    <span>
                      {user.fullName} ({user.email})
                    </span>
                    <Check className="w-4 h-4 text-green-500" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              onClick={handleCreateTeam}
              className="bg-accent w-full text-accent-foreground"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
