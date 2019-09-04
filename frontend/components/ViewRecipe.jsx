import React, { Component } from 'react';
import '../css/ViewRecipe.css';

export default class ViewRecipe extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: true,
      isFetchingData: true,      
      message: 'Loading...',
      recipe: {},
      calculateServings: 1
    }

    this.getCourseTypeName = this.getCourseTypeName.bind(this);
    this.buildIngredients = this.buildIngredients.bind(this);
    this.buildTags = this.buildTags.bind(this);

    this.increasePeople = this.increasePeople.bind(this);
    this.decreasePeople = this.decreasePeople.bind(this);
    this.handleServingsChange = this.handleServingsChange.bind(this);   
  }

  componentDidMount() {
    fetch('/api/getrecipebyid?q=' + this.props.match.params.id)
      .then(res => res.json())
      .then(res => this.setState({
        isFetchingData: false,
        recipe: res[0],
        isLoading: false
      }))
  }

  getCourseTypeName(courseType) {
    if (courseType === 'starter' ) {
      return "Vorspeise";
    }
    if (courseType === 'main' ) {
      return "Hauptspeise";
    }
    if (courseType === 'dessert' ) {
      return "Nachspeise";
    }
    if (courseType === 'side' ) {
      return "Beilage";
    }
    if (courseType === 'sauce' ) {
      return "Sauce/Dressing";
    }    
  }

  buildSteps(step) {
    return (
      <li key={step[0]}>
        {step[1]}
      </li>
    )
  }

  buildIngredients(ingredient) {
    return (
      <li key={ingredient._id}>
        {(ingredient.amount * this.state.calculateServings)} {ingredient.unit.title} {ingredient.item.title}
      </li>
    )
  }

  buildTags(tag) {
    return (
      <li key={tag._id}>
        {tag.title}
      </li>
    )
  }

  increasePeople() {
    this.setState({calculateServings: parseInt(this.state.calculateServings) + 1});
  }
  
  decreasePeople() {
    if (parseInt(this.state.calculateServings) > 1) {
      this.setState({calculateServings: parseInt(this.state.calculateServings) - 1});
    }
  }

  handleServingsChange(e) {
    this.setState({calculateServings: e.target.value})
  }  

  render() {
    if (this.state.isLoading) {
      return <p>{this.state.message}</p>;
    }
    else { 
      if (this.state.isFetchingData) {
        const spinner = document.getElementById('spinner');
        if (spinner && !spinner.hasAttribute('hidden')) {
          spinner.classList.remove('hidden');
        }
      }
      if (!this.state.isFetchingData) {
        const spinner = document.getElementById('spinner');
        if (spinner && !spinner.hasAttribute('hidden')) {
          spinner.classList.add('hidden');
        }
      }

      let stepArray = this.state.recipe.steps.split(",");
      var tempArray = [];

      for (let i = 0; i < stepArray.length; i++) {
        tempArray.push([i, stepArray[i]])
      }

      var recipeSteps = tempArray.map(this.buildSteps);
      var recipeIngredients = this.state.recipe.ingredients.map(this.buildIngredients);
      var recipeTags = this.state.recipe.tags.map(this.buildTags);

      return (
        <div className="container">
          <div className="container-fluid">

            <div className="d-flex justify-content-center hidden" id="spinner">
              <div className="spinner-border" role="status">
                <span className="sr-only">Laden...</span>
              </div>
            </div>

            <h1 className="headline">{this.state.recipe.title}</h1>

            <div className="row">
              <img className="col-7" src={process.env.PUBLIC_URL + '/users/' + this.state.recipe.image} />
              <div className="col">
                <p>{this.state.recipe.description}</p>
                <p>{this.state.recipe.origin}</p>
                <p>{this.getCourseTypeName(this.state.recipe.formType)}</p>
                <div className="wrapper">
                  <div className="value-button btn-danger" id="decrease" onClick={this.decreasePeople}>-</div>
                  <input type="text" pattern="[0-9]*" className="form-control" id="people" value={this.state.calculateServings} onChange={this.handleServingsChange}/>
                  <div className="value-button btn-success" id="increase" onClick={this.increasePeople}>+</div>
                </div>
                <ul className="tag-list">
                  {recipeTags}
                </ul>
              </div>
            </div>

            <hr />
            
            <h1 className="recipe-headline">Zutaten</h1>
            <ul className="ingredient-list">
              {recipeIngredients}
            </ul>

            <hr />

            <h1 className="recipe-headline">Schritte</h1>
            <ol className="step-list">
              {recipeSteps}
            </ol>

          </div>
        </div>

      );
    }
  }
}