import React, { useState } from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { PageLayout } from "./components/PageLayout";
import { callMsGraph } from "./graph";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import AutoComplete from "@material-ui/lab/Autocomplete";
import "./styles/App.css";
import sites from "./sites";

const Content = () => {
  const { instance, accounts } = useMsal();
  const [nameData, setNameData] = useState([]);
  const [site, setSite] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const RequestNameData = async () => {
    try {
      if (!site) {
        setError("Please choose your site.");
        setMessage(null);
        setNameData([]);
        return;
      }
      if (error) {
        setError(null);
      }
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });
      const data = await callMsGraph(response.accessToken, "/messages");
      const date = new Date().toLocaleDateString();
      const newData = data.value.reduce((carry, mail) => {
        if (
          mail.from &&
          mail.from.emailAddress.address === "qualtricssurvey@uoregon.edu"
        ) {
          if (mail.body.content.includes(site)) {
            const mailDate = new Date(mail.sentDateTime).toLocaleDateString();
            if (date === mailDate) {
              const arr = mail.body.content.split("Name:");
              const name = arr[arr.length - 1].split("<")[0];
              carry.push(name);
            }
          }
        }
        return carry;
      }, []);
      if (newData.length > 0) {
        setMessage(null);
        setNameData(newData);
      } else {
        setNameData([])
        setMessage(`No registered names found for ${site}`)
      }
    } catch (e) {
      return setMessage(e.message);
    }
  };

  const siteChangeHandler = (value) => {
    if (!value) {
      return setSite(null);
    }
    setSite(value.value);
    setMessage(null);
    setNameData([]);
    setError(null);
  }

  const names = nameData.map((name, index) => {
    return (
      <li key={index} style={{ textAlign: "left" }}>
        {name}
      </li>
    );
  });
  if (accounts[0].username === "osjp@uoregon.edu") {
    return (
      <div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginBottom: "40px" }}>
          <AutoComplete
            id="site-input"
            options={sites}
            getOptionLabel={(option) => option.label}
            style={{ width: 400 }}
            onChange={(event, value) => siteChangeHandler(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Input Site Code or Location"
                variant="outlined"
              />
            )}
          />
          {error &&
            <div
              style={{ width: "100%", color: "red" }}>
              {error}
            </div>
          }
        </div>
        <Button variant="contained" color="primary" onClick={RequestNameData}>
          Request Registered Names
        </Button>
        <hr></hr>
        <ol style={{ marginTop: "15px" }}>{names}</ol>
        {names.length === 0 && message &&
          <div>
            {message}
          </div>
        }
      </div>
    );
  }
  return (
    <div>
      <p>You need to be signed into osjp@uoregon.edu to use this app. You are currently signed into {accounts[0].username}</p>
      <p>If you don't see osjp@uoregon.edu as an option in the sign in popup, you need to first login <a href="https://outlook.live.com/owa/?nlp=1" target="_blank">here</a>.</p>
    </div >
  );
};

const MainContent = () => {
  return (
    <div className="App">
      <AuthenticatedTemplate>
        <Content />
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <h5 className="card-title">
          Please sign-in to see your profile information.
        </h5>
      </UnauthenticatedTemplate>
    </div>
  );
};

export default function App() {
  return (
    <PageLayout>
      <MainContent />
    </PageLayout>
  );
}
