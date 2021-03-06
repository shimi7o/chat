import React, { useState } from "react";
import Amplify, { Auth } from "aws-amplify";
import { AmplifyAuthenticator, AmplifySignUp } from "@aws-amplify/ui-react";
import {
  AuthState,
  onAuthUIStateChange,
  CognitoUserInterface,
} from "@aws-amplify/ui-components";
import awsconfig from "./aws-exports";
import Content from "./Content";
import { RecoilRoot } from "recoil";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

Amplify.configure(awsconfig);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    toolBar: {
      display: "flex",
    },
    signOut: {
      marginLeft: "auto",
      display: "flex",
    },
  })
);

const App = () => {
  const classes = useStyles();
  const [authState, setAuthState] = useState<AuthState>();
  const [user, setUser] = useState<CognitoUserInterface | undefined>();

  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState as AuthState);
      setUser(authData as CognitoUserInterface);
    });
  }, []);

  const handleClick = () => {
    Auth.signOut();
  };

  return authState === AuthState.SignedIn && user ? (
    <div>
      <RecoilRoot>
        <AppBar className={classes.appBar}>
          <Toolbar className={classes.toolBar}>
            <Typography variant="h6" noWrap>
              ChatApp
            </Typography>
            <div onClick={handleClick} className={classes.signOut}>
              <IconButton
                aria-label="display more actions"
                edge="end"
                color="inherit"
              >
                <ExitToAppIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <Content userName={user.username} />
      </RecoilRoot>
    </div>
  ) : (
    <AmplifyAuthenticator>
      <AmplifySignUp
        slot="sign-up"
        formFields={[
          { type: "username" },
          { type: "password" },
          { type: "email" },
        ]}
      />
    </AmplifyAuthenticator>
  );
};

export default App;
