import React, { useState } from "react";
import Amplify from "aws-amplify";
import {
  AmplifyAuthenticator,
  AmplifySignUp,
  AmplifySignOut,
} from "@aws-amplify/ui-react";
import {
  AuthState,
  onAuthUIStateChange,
  CognitoUserInterface,
} from "@aws-amplify/ui-components";
import awsconfig from "./aws-exports";
import Content from "./Content";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { makeStyles } from "@material-ui/core/styles";

Amplify.configure(awsconfig);

const useStyles = makeStyles({
  signOut: {
    margin: "auto",
    width: 150,
    height: 60,
  },
});

const App = () => {
  const classes = useStyles();
  const [authState, setAuthState] = useState();
  const [user, setUser] = useState<CognitoUserInterface | undefined>();

  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      //@ts-ignore
      setAuthState(nextAuthState);
      setUser(authData as CognitoUserInterface);
    });
  }, []);

  return authState === AuthState.SignedIn && user ? (
    <div>
      <RecoilRoot>
        <Content userName={user.username} />
        <div className={classes.signOut}>
          <AmplifySignOut />
        </div>
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
