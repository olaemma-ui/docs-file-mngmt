import { IHttpClient } from "@/core/client/http.client";
import { Result } from "@/core/client/result";
import { LoginDTO } from "../dto/auth.dto";
import { UserEntity } from "@/app/users/entities/user.entity";

export class AuthService {
    private http: IHttpClient;

    constructor(httpClient: IHttpClient) {
        this.http = httpClient;
    }

    async login(payload: LoginDTO): Promise<
        Result<{
            accessToken: string;
            refreshToken: string,
            user: UserEntity
        }>
    > {

        return this.http.post({ url: "/auth/login", data: payload });

    }

    async logout(): Promise<Result<null>> {
        return this.http.post({ url: "/auth/logout" });
    }

    async refreshToken(): Promise<Result<{ token: string }>> {
        return this.http.post({ url: "/auth/refresh" });
    }

    async getCurrentUser(): Promise<Result<UserEntity>> {
        return this.http.get({ url: "/auth/me" });
    }

}
