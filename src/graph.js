import { graphConfig } from "./authConfig";

/**
 * Attaches a given access token to a MS Graph API call. Returns information about the user
 * @param accessToken 
 */
export async function callMsGraph(accessToken, endpoint) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    const URL = endpoint ? `${graphConfig.graphMeAPI}${endpoint}` : graphConfig.graphMeAPI;

    return fetch(URL, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}
