import React from "react";
import { connect } from "react-redux";
import { signIn, signOut } from "../actions";

class GoogleAuth extends React.Component {
  componentDidMount() {
    //initialisiere Google API Library -> der user wird durch den folgenden Code nicht in den oauth flow geleitet
    window.gapi.load("client:auth2", () => {
      //diese Callback Funktion initialisiert den Client mit der Client ID der Google API
      //der scope gibt an welche Daten man von der Google API benötigt

      //gapi.client.init gibt ein Promise zurück
      window.gapi.client
        .init({
          clientId:
            "122062150709-6jpl5kjs3m2qssr8qhdlvtdec5ebco2k.apps.googleusercontent.com",
          scope: "email",
        })
        .then(() => {
          //diese Callback wird ausgeführt wenn die gapi Library erfolgreich initialisiertt wurde
          this.auth = window.gapi.auth2.getAuthInstance();

          this.onAuthChange(this.auth.isSignedIn.get());

          //onAuthChange wird jedes mal aufgerufen wenn sich der auth status des Users ändert
          this.auth.isSignedIn.listen(this.onAuthChange);
        });
    });
  }
  //die Callback Mtehode erhält von der Listen Methode ein boolean Paramter übergeben, der signalisiert ob der User angemeldet ist oder nicht
  onAuthChange = (isSignedIn) => {
    //this.setState({ isSignedIn: this.auth.isSignedIn.get() });

    if (isSignedIn) {
      //currentUser Funktion des gapi Objektes zeigt die Daten des aktull angemeldeten Users an -> dei Funktinen get().getId() filtern die google id des Users heraus
      this.props.signIn(this.auth.currentUser.get().getId());
    } else {
      this.props.signOut();
    }
  };

  onSignInClick = () => {
    this.auth.signIn();
  };

  onSignOutClick = () => {
    this.auth.signOut();
  };

  renderAuthButton() {
    if (this.props.isSignedIn === null) {
      return null;
    } else if (this.props.isSignedIn) {
      return (
        <button onClick={this.onSignOutClick} className="ui red google button">
          <i className="google icon" />
          Sign Out
        </button>
      );
    } else {
      return (
        <button onClick={this.onSignInClick} className="ui red google button">
          <i className="google icon" />
          Sign in with Google
        </button>
      );
    }
  }

  render() {
    return <div>{this.renderAuthButton()}</div>;
  }
}

const mapStateToProps = (state) => {
  return { isSignedIn: state.auth.isSignedIn };
};

export default connect(mapStateToProps, { signIn, signOut })(GoogleAuth);
