import React from "react";
import { useMsal } from "@azure/msal-react";
import Button from "@material-ui/core/Button";

export const SignOutButton = () => {
    const { instance } = useMsal();

    const handleLogout = () => {
        instance.logoutPopup({
            postLogoutRedirectUri: "/",
            mainWindowRedirectUri: "/"
        });
    }
    return (
        <Button variant="contained" color="default" onClick={() => handleLogout()}>
            Sign Out
        </Button>
    )
}