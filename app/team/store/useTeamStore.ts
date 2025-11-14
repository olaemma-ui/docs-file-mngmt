"use client";

import { create } from "zustand";
import { TeamService } from "../service/team.service";
import { TeamEntity } from "../entities/team.entity";
import { CreateTeamPayload } from "../dto/create-team.dto";
import { IHttpClient } from "@/core/client/http.client";
import { AxiosHttpClient } from "@/core/client/axios.client";
import { Result } from "@/core/client/result";

// Initialize HttpClient
const httpClient: IHttpClient = new AxiosHttpClient(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
);

const teamService = new TeamService(httpClient);

interface TeamState {
    teams: TeamEntity[];
    selectedTeam?: TeamEntity | null;
    loading: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    error?: string | null;

    listTeams: (query?: Record<string, any>) => Promise<void>;
    getMyTeam: (query?: Record<string, any>) => Promise<void>;
    getTeam: (teamId: string) => Promise<void>;
    createTeam: (payload: CreateTeamPayload) => Promise<Result<TeamEntity> | undefined>;
    updateTeam: (teamId: string, payload: Partial<CreateTeamPayload>) => Promise<Result<TeamEntity> | undefined>;
    deleteTeamMember: (teamId: string, userId: string) => Promise<Result<null> | undefined>;
    inviteMembers: (teamId: string, emails: string[], role: string) => Promise<Result<null> | undefined>;
}

export const useTeamStore = create<TeamState>((set, get) => ({
    teams: [],
    selectedTeam: null,
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    error: null,

    async listTeams(query) {
        set({ loading: true, error: null });
        try {
            const result = await teamService.listTeams(query);
            if (!result.hasError && result.data) set({ teams: result.data });
            else set({ error: result.message });
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    },

    async getMyTeam(query) {
        set({ loading: true, error: null });
        try {
            const result = await teamService.getMyTeam(query);
            if (!result.hasError && result.data) set({ teams: result.data });
            else set({ error: result.message });
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    },

    async getTeam(teamId) {
        set({ loading: true, error: null });
        try {
            const result = await teamService.getTeam(teamId);
            if (!result.hasError && result.data) set({ selectedTeam: result.data });
            else set({ error: result.message });
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    },

    async createTeam(payload) {
        set({ creating: true, error: null });
        try {
            const result = await teamService.createTeam(payload);
            if (!result.hasError && result.data) {
                set((state) => ({ teams: [result.data!, ...state.teams] }));
            } else set({ error: result.message });
            return result;
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ creating: false });
        }
    },

    async updateTeam(teamId, payload) {
        set({ updating: true, error: null });
        try {
            const result = await teamService.updateTeam(teamId, payload);
            if (!result.hasError && result.data) {
                set((state) => ({
                    teams: state.teams.map((t) => (t.id === teamId ? result.data! : t)),
                    selectedTeam: result.data,
                }));
            } else set({ error: result.message });
            return result;
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ updating: false });
        }
    },

    async deleteTeamMember(teamId, userId) {
        set({ deleting: true, error: null });
        try {
            const result = await teamService.deleteTeamMember(teamId, userId);
            if (!result.hasError) {
                set((state) => ({
                    selectedTeam: state.selectedTeam
                        ? {
                            ...state.selectedTeam,
                            members: state.selectedTeam.members?.filter((m) => m.id !== userId),
                        }
                        : state.selectedTeam,
                }));
            } else set({ error: result.message });
            return result;
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ deleting: false });
        }
    },

    async inviteMembers(teamId, emails, role) {
        set({ updating: true, error: null });
        try {
            const result = await teamService.inviteMembers(teamId, emails, role);
            return result;
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ updating: false });
        }
    },
}));
