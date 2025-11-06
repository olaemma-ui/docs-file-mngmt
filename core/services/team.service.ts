import { IHttpClient } from "@/core/client/http.client"; import { Result } from "../client/result";

export interface Team {
    id: string;
    name: string;
    description?: string;
    members?: Array<{ id: string; name?: string; email?: string }>;
    [key: string]: any;
}

export interface CreateTeamPayload {
    name: string;
    description?: string;
    memberIds?: string[];
}

export class TeamService {
    private http: IHttpClient;

    constructor(httpClient: IHttpClient) {
        this.http = httpClient;
    }

    async listTeams(): Promise<Result<Team[]>> {
        return this.http.get({ url: "/teams" });
    }

    async getTeam(id: string): Promise<Result<Team>> {
        return this.http.get({ url: `/teams/${id}` });
    }

    async createTeam(payload: CreateTeamPayload): Promise<Result<Team>> {
        return this.http.post({ url: "/teams", data: payload });
    }

    async updateTeam(id: string, payload: Partial<CreateTeamPayload>): Promise<Result<Team>> {
        return this.http.patch({ url: `/teams/${id}`, data: payload });
    }

    async deleteTeam(id: string): Promise<Result<null>> {
        return this.http.delete({ url: `/teams/${id}` });
    }

    async addMember(teamId: string, userId: string): Promise<Result<Team>> {
        return this.http.post({ url: `/teams/${teamId}/members`, data: { userId } });
    }

    async removeMember(teamId: string, userId: string): Promise<Result<null>> {
        return this.http.delete({ url: `/teams/${teamId}/members/${userId}` });
    }
}
