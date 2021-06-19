import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import Button from "@material-ui/core/Button";

export const SignInButton = () => {
    const { instance } = useMsal();

    const handleLogin = (loginType) => {
        instance.loginPopup(loginRequest).catch(e => {
            console.log(e);
        });
    }
    return (
        <Button variant="contained" color="default" onClick={() => handleLogin()}>
            Sign In
        </Button>
    )
}