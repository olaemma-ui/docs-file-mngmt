import { User } from 'lucide-react';
import { IHttpClient } from "@/core/client/http.client"; import { Result } from "../../../core/client/result";
import { AccountStatus } from "../../../core/enums/users.enums";
import { UserEntity } from '../entities/user.entity';
import { CreateUserPayload } from '../dto/create-user.dto';


export class UserService {
    private http: IHttpClient;

    constructor(httpClient: IHttpClient) {
        this.http = httpClient;
    }

    async listUsers(query?: Record<string, any>): Promise<Result<UserEntity[]>> {
        const queryString = query ? `?${new URLSearchParams(query).toString()}` : "";
        return this.http.get({ url: `/users${queryString}` });
    }

    async getUser(id: string): Promise<Result<UserEntity>> {
        return this.http.get({ url: `/users/${id}` });
    }

    async createUser(payload: CreateUserPayload): Promise<Result<UserEntity>> {
        return this.http.post({ url: "/users", data: payload });
    }

    async updateUser(
        id: string, 
        payload: Partial<CreateUserPayload & Record<string, any>>
    ): Promise<Result<UserEntity>> {
        return this.http.patch({ url: `/users/${id}`, data: payload });
    }

    async deleteUser(id: string): Promise<Result<null>> {
        return this.http.delete({ url: `/users/${id}` });
    }

    async assignRole(id: string, role: string): Promise<Result<UserEntity>> {
        return this.http.post({ url: `/users/${id}/roles`, data: { role } });
    }
}
