import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";

const facebookConfig = {
  authURL: "https://www.facebook.com/v7.0/dialog/oauth",
  redirectURL: "http://localhost:3000/facebook/callback",
  appID: "3039241486143593",
  responseType: "token",
};

const googleConfig = {
  authURL: "https://accounts.google.com/o/oauth2/v2/auth",
  redirectURL: "http://localhost:3000/google/callback",
  appID:
    "466189421022-2jueo47b18b1eq57h1rnesdl9895f323.apps.googleusercontent.com",
  responseType: "token",
  scope: "openid profile email",
};

function FacebookCallback() {
  const history = useHistory();
  const search = window.location.hash;
  const query = new URLSearchParams(search.slice(1));
  localStorage.setItem("facebook-token", query.get("access_token"));
  history.replace("/");
  return <div>Facebook</div>;
}

function GoogleCallback() {
  const history = useHistory();
  const search = window.location.hash;
  const query = new URLSearchParams(search.slice(1));
  localStorage.setItem("google-token", query.get("access_token"));
  history.replace("/");
  return <div>Google</div>;
}

function Home() {
  const state = "{st=123,ds=abc}";
  const facebookLogin = `${facebookConfig.authURL}?client_id=${facebookConfig.appID}&redirect_uri=${facebookConfig.redirectURL}&state=${state}&response_type=${facebookConfig.responseType}`;
  const [facebookProfile, setFacebookProfile] = useState({});

  const googleLogin = `${googleConfig.authURL}?client_id=${googleConfig.appID}&redirect_uri=${googleConfig.redirectURL}&state=abc&response_type=${googleConfig.responseType}&scope=${googleConfig.scope}`;
  const [googleProfile, setGoogleProfile] = useState({});

  useEffect(() => {
    const access_token = localStorage.getItem("facebook-token");
    if (access_token) {
      const api = "https://graph.facebook.com/v7.0/me";
      const url = `${api}?access_token=${access_token}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setFacebookProfile(data);
        })
        .catch((err) => console.error(err));
    }
  }, []);

  useEffect(() => {
    const access_token = localStorage.getItem("google-token");
    if (access_token) {
      const api = "https://openidconnect.googleapis.com/v1/userinfo";
      const url = `${api}?access_token=${access_token}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setGoogleProfile(data);
        })
        .catch((err) => console.error(err));
    }
  }, []);

  return (
    <div className="home">
      {facebookProfile.id && (
        <div>
          <div>Facebook ID: {facebookProfile.id}</div>
          <div>Name: {facebookProfile.name}</div>
        </div>
      )}
      <div>
        {facebookProfile.id ? (
          <a
            onClick={(e) => {
              e.preventDefault();
              localStorage.setItem("facebook-token", "");
              setFacebookProfile({});
            }}
          >
            Facebook Logout
          </a>
        ) : (
          <a href={facebookLogin}>Facebook Login</a>
        )}
      </div>
      {googleProfile.sub && (
        <div>
          <div>Google ID (sub): {googleProfile.sub}</div>
          <div>Name: {googleProfile.name}</div>
          <div>
            Profile Picture:
            <div style={{ width: "48px" }}>
              <img src={googleProfile.picture} style={{ width: "100%" }} />
            </div>
          </div>
        </div>
      )}
      <div>
        {googleProfile.sub ? (
          <a
            onClick={(e) => {
              e.preventDefault();
              localStorage.setItem("google-token", "");
              setGoogleProfile({});
            }}
          >
            Google Logout
          </a>
        ) : (
          <a href={googleLogin}>Google Login</a>
        )}
      </div>
    </div>
  );
}

// This code is meant to be used as illustration purpose
// If you actually need to do facebook login, please use Facebook SDK
function App() {
  return (
    <div>
      <Router>
        <nav>
          <Link to="/">Home</Link>
        </nav>
        <div className="container">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/facebook/callback">
              <FacebookCallback />
            </Route>
            <Route exact path="/google/callback">
              <GoogleCallback />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
