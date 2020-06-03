import React from "react";
import { Field, reduxForm } from "redux-form";

class StreamForm extends React.Component {
  renderError({ error, touched }) {
    if (touched && error) {
      return (
        <div className="ui error message">
          <div className="header">{error}</div>
        </div>
      );
    }
  }

  renderInput = (formProps) => {
    const className = `field ${
      formProps.meta.error && formProps.meta.touched ? "error" : ""
    }`;
    return (
      /*
      <input
        onChange={formProps.input.onChange}
        value={formProps.input.value}
      />
      */
      //refactor
      //alle props die von Field automatisch durch redux-form lib an die input Komponenten übergeben werde über {...xyz} Synatx an input Komponente übergeben.
      <div className={className}>
        <label>{formProps.label}</label>
        <input {...formProps.input} />
        {this.renderError(formProps.meta)}
      </div>
    );
  };

  //this.props.handelSubmit Funktion wird aurtomatisch die Werte der Field Komponenten an die onSubmit Funktion als Paramter übergeben.
  onSubmit = (formValues) => {
    //event.preventDefault(); -> wird automatisch von redux form aufgerufen, daher ist es nicht nötig das event Objekt als paramter für onSubmit zu erhalten
    console.log(formValues);
    this.props.onSubmit(formValues);
  };

  render() {
    //unter dem component props wird die von Field verwaltete Komponente übergeben, da die Field Komponente an sich nichts auf den Screen rendert

    //props die der Field Komponente übergeben werden, werden automatisch der Callback Funktion unter component übergeben.

    //handleSubmit Funktion wird automatisch von der redux-form lib an die props der komponente übergeben

    //die props der Field Komponente wie zB name="title" werden in der verwalteten Komponente in ein Objekt mit key title und dem wert der in das input Tag eingegebe string umgewandelt -> {title: "string des inputs"}

    //ohne die className error der form Komponente versteckt semantic ui error Nachrichten -> diese wollen wir aber im Valdidierungsprozess anzeigen, also muss die className error hinzugefügt werden
    return (
      <form
        onSubmit={this.props.handleSubmit(this.onSubmit)}
        className="ui form error"
      >
        <Field name="title" component={this.renderInput} label="Enter Title" />
        <Field
          name="description"
          component={this.renderInput}
          label="Enter description"
        />
        <button type="submit" className="ui button primary">
          Submit
        </button>
      </form>
    );
  }
}

//validate erhält alle Werte der Form als Paramter

// wenn ein leeres Objekt von validate zurückgegebn wurde so ist alles ok

//wurde kein leeres Objekt zurückgegeben so hat der user eine falsche eingabe gemacht und redux form rerendert automatisch die Komponente. Besitzt eine von der Field Komponente verwaltete Komponente dieselben werte wie das zurückgegebene Error Objekt so wird eine error Variable an Field als Props übergeben -> dieses prop wiederum wied als Paramter in dem formProps.meta Objekt an die renderInput Funktion übergeben.

//jedes mal wenn der user mit dem input Feld interagiert so wird die validate Funktion afgerufen
const validate = (formValues) => {
  const errors = {};

  if (!formValues.title) {
    errors.title = "You must enter a title !";
  }

  if (!formValues.description) {
    errors.description = "You must enter a description !";
  }

  return errors;
};

//redux form speichert ale Werte der form unter dem key "streamForm

//in das KonfigurationsObjekt muss die validate Funktion unter dem Key validate übergeben werden
export default reduxForm({
  form: "streamForm",
  validate: validate,
})(StreamForm);
