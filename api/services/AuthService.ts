import { AuthClient } from "../clients/AuthClient";
import { LoginSuccessResponse } from "../models/Auth/response/LoginSuccessResponse";
import { LoginFailureResponse } from "../models/Auth/response/LoginFailureResponse";

export class AuthService {

    private apiClient: AuthClient;

    constructor(apiClient: AuthClient) {
        this.apiClient = apiClient;
    }

    async login(email: string, password: string) {

        const response = await this.apiClient.login({
            email,
            password
        });

        const data = await response.json() as LoginSuccessResponse | LoginFailureResponse;

        if (data.success) {
            return data;
        } else {
            throw new Error(data.error);
        }
    }

}