/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import Navbar from "react-bootstrap/Navbar";

import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";

/**
 * Renders the navbar component with a sign-in or sign-out button depending on whether or not a user is authenticated
 * @param props 
 */
export const PageLayout = (props) => {
    const isAuthenticated = useIsAuthenticated();
    const { accounts } =  useMsal();

    return (
        <div>
            <Navbar bg="primary" variant="dark">
                <a className="navbar-brand" href="/">RADx-UP Registration Checker</a>
                { isAuthenticated && accounts[0].username === "osjp@uoregon.edu" ? <SignOutButton /> : <SignInButton /> }
            </Navbar>
            <h5 style={{marginTop: "15px"}}><center>Welcome To The Registration Checker</center></h5>
            <br />
            <br />
            {props.children}
        </div>
    );
};
