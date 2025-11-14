import { IHttpClient } from "@/core/client/http.client";
import { Result } from "@/core/client/result";
import { CreateTeamPayload } from "../dto/create-team.dto";
import { TeamEntity } from "../entities/team.entity";

export class TeamService {
    private http: IHttpClient;

    constructor(httpClient: IHttpClient) {
        this.http = httpClient;
    }

    async listTeams(query?: Record<string, any>): Promise<Result<TeamEntity[]>> {
        const queryString = query ? `?${new URLSearchParams(query).toString()}` : "";
        return this.http.get({ url: `/team/all${queryString}` });
    }

    async getMyTeam(query?: Record<string, any>): Promise<Result<TeamEntity[]>> {
        const queryString = query ? `?${new URLSearchParams(query).toString()}` : "";
        return this.http.get({ url: `/team/me${queryString}` });
    }

    async getTeam(teamId: string): Promise<Result<TeamEntity>> {
        return this.http.get({ url: `/team/${teamId}` });
    }

    async createTeam(payload: CreateTeamPayload): Promise<Result<TeamEntity>> {
        return this.http.post({ url: "/team/create", data: payload });
    }

    async updateTeam(teamId: string, payload: Partial<CreateTeamPayload>): Promise<Result<TeamEntity>> {
        return this.http.patch({ url: `/team/${teamId}`, data: payload });
    }

    async deleteTeamMember(teamId: string, userId: string): Promise<Result<null>> {
        return this.http.delete({ url: `/team/${teamId}/member/${userId}` });
    }

    async inviteMembers(teamId: string, emails: string[], role: string): Promise<Result<null>> {
        return this.http.post({ url: `/team/invite/${teamId}`, data: { emails, role } });
    }
}
