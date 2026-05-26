import { AuthClient } from "../clients/AuthClient";
import { LoginSuccessResponse } from "../models/auth/response/LoginSuccessResponse";
import { LoginFailureResponse } from "../models/auth/response/LoginFailureResponse";

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

        console.log(response.status());
        console.log(response.url())

        const data = await response.json() as LoginSuccessResponse | LoginFailureResponse;

        if (data.success) {
            return data;
        } else {
            throw new Error(data.error);
        }
    }

}