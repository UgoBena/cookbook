import React, { Component } from 'react';
import '../../css/App.css';
import '../../css/CreateRecipe.css';

import AddStep from './AddStep.jsx';
import SearchTag from './SearchTag.jsx';
import AddIngredient from './AddIngredient.jsx';
import SearchIngredient from './SearchIngredient.jsx';
import ImageDropzone from './ImageDropzone.jsx';
import FormValidator from '../FormValidator.jsx';

import {countryOptions} from './SelectOptions.jsx';
import {dishOptions} from './SelectOptions.jsx';

import Select from 'react-select';

export default class CreateRecipe extends Component {
  constructor() {
    super();

    this.validator = new FormValidator([
      { 
        field: 'tags', 
        method: this.arrayNotEmpty, 
        validWhen: true, 
        message: 'Tags are required.' 
      },
      { 
        field: 'tags',
        method: this.arrayBiggerThanThree, 
        validWhen: true, 
        message: 'At least 3 tags are needed'
      },
      { 
        field: 'ingredients', 
        method: this.arrayNotEmpty, 
        validWhen: true, 
        message: 'Ingredients are required'
      },
      { 
        field: 'steps', 
        method: this.arrayNotEmpty, 
        validWhen: true, 
        message: 'Steps are required.'
      }/*,
      { 
        field: 'password_confirmation', 
        method: 'isEmpty', 
        validWhen: false, 
        message: 'Password confirmation is required.'
      },
      { 
        field: 'password_confirmation', 
        method: this.passwordMatch,   // notice that we are passing a custom function here
        validWhen: true, 
        message: 'Password and password confirmation do not match.'
      }*/
    ]);

    this.state = {
      message: 'Loading...',
      isFocused: false,
      tags: [],
      ingredients: [],
      steps: [],
      validation: this.validator.valid(),
    }
    
    this.submitted = false;

    this.onStepAdd = this.onStepAdd.bind(this);
    this.handleTagSelect = this.handleTagSelect.bind(this);
    this.handleIngredientSelect = this.handleIngredientSelect.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentDidMount() {
    fetch('/api/recipelist')
      .then(res => res.text())
      .then(res => this.setState({message: res}));
  }

  onStepAdd(e) {
    let step = this.refs.step.value;

    let newStep = {
      text: step,
      key: 'step' + parseInt(this.state.steps.length+1)
    }

    this.setState((prevState) => {
      return {
        steps: prevState.steps.concat(newStep)
      };
    });
    this.refs.step.value = '';
    e.preventDefault();
  }

  handleTagSelect(options) {
    this.setState({tags: options});
  }

  handleIngredientSelect(options) {
    this.setState({ingredients: options});
    console.log(this.state.ingredients);
  }

  getIngredients = () => {
    var ingredientArray = this.child.getAllIngredients()
    console.log(ingredientArray);
  }

  arrayNotEmpty = (array) => (array.length > 0)
  arrayBiggerThanThree = (array) => (array.length >= 3)

  handleFormSubmit = event => {
    event.preventDefault();

    const validation = this.validator.validate(this.state);
    this.setState({ validation });
    this.submitted = true;

    if (validation.isValid) {
      console.log('form is valid and can be submitted.');
    }
    else {
      console.log('form is not valid.');
    }
  }

  render() {
   let validation = this.submitted ?
                    this.validator.validate(this.state) :
                    this.state.validation

    return (
       <form className="create-recipe-form">
      <div className="container">
          <div className="container-fluid">

            <div className="row d-md-block">
                <span id="titleWrapper" className="input input--animated">
                  <input id="recipeTitle" className="input__field input__field--animated" name="recipeTitle" type="text"/>
                  <label className="input__label input__label--animated input__label--animated-color-1" htmlFor="recipeTitle">
                    <span className="input__label-content input__label-content--animated">Neues Rezept erstellen</span>
                  </label>                  
                </span>
            </div>

            <hr />

            <h1 className="recipe-headline" htmlFor="ingredients">Generelle Angaben</h1>

            <div id="generalInfo" className="row">

              <div className="col-md-auto float-left">
                <div className="dropzone-wrapper">
                  <ImageDropzone/>
                </div>
              </div> 

              <div className="input-group col">
                <div className="row">
                  <textarea id="description" className="general-info-input" name="textarea" placeholder="Kurzbeschreibung des Rezepts"></textarea>
                  <small className="form-text text-muted">Nach was schmeckt das Rezept? Ist es schnell zuzubereiten? Etc.</small>
                </div>

                <div className="row">
                  <Select
                    placeholder="-- Bitte Herkunfsland auswählen --"
                    label="Single select"
                    options={countryOptions}
                    className="general-info-input"
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        text: '#6a7989',
                        primary25: '#289fad',
                        primary: '#6a7989',
                      },
                    })}
                  />
                  <small className="form-text text-muted">Wo kommt das Rezept her?</small>
                </div>

                <div className="row">
                  <Select
                    placeholder="-- Bitte Rezeptart auswählen --"
                    label="Single select"
                    options={dishOptions}
                    className="general-info-input"
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        text: '#6a7989',
                        primary25: '#289fad',
                        primary: '#6a7989',
                      },
                    })}                  
                  />
                  <small className="form-text text-muted">Vorspeise, Hauptspeise, Nachspeise, usw.</small>
                </div>

                <div className="row">
                    <div className={'input-group ' + (validation.tags.isInvalid && 'has-error')}>
                      <SearchTag onSelectTag={this.handleTagSelect}/>
                    </div>
                  <small className="form-text text-muted">Erstelle oder suche 3 Begriffe, um das Rezept zu beschreiben (scharf, Eintopf, Braten, usw.)</small>
                </div>
              </div>
            </div>

            <hr />

            <div className="row" id="ingredients">
              <div className="form-group col">

                <h1 className="recipe-headline" htmlFor="ingredients">Zutaten</h1>

                <div className={'input-group ' + (validation.ingredients.isInvalid && 'has-error')}>
                  <SearchIngredient onSelectIngredient={this.handleIngredientSelect}/>
                  <small className="form-text text-muted">Suche oder erstelle Zutaten, um sie dem Rezept hinzuzufügen.</small>
                  <AddIngredient entries={this.state.ingredients}/>
                </div>
              </div>
            </div>
              
            <hr />

              <div className="row">
                <div className="form-group col">
                  <h1 className="recipe-headline" htmlFor="ingredients">Zubereitung</h1>
                    
                    <div className="input-group">
                      <input 
                        id="step" 
                        name="step" 
                        type="text" 
                        ref="step"
                        className={'col form-control step-control ' + (validation.steps.isInvalid && 'has-error')}
                        onKeyPress={event => {
                          if (event.key === 'Enter') {
                            this.onStepAdd(event)
                          }
                        }}
                      />
                      <small className="form-text text-muted">Suche oder erstelle Zutaten, um sie dem Rezept hinzuzufügen.</small>
                    </div>
                    <AddStep entries={this.state.steps}/>
                  </div>
              </div>

          </div>
      </div>
      <button onClick={this.handleFormSubmit} className="btn btn-primary">
          Sign up
       </button>
       </form>
    );
  }
}