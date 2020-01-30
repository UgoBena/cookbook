from flask import Blueprint, request, jsonify
from flask_jwt_extended import (jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)

import controllers.auth as auth
import controllers.user as user
import controllers.recipe as recipe
import controllers.tag as tag
import controllers.ingredient as ingredient
import controllers.unit as unit
import controllers.upload as upload

from application import jwt

from flask_mail import Message
from application import mail

routes = Blueprint('routes', __name__)

###
# Defines all routes used in the backend, checks for authentication (jwt_reauired), passes data to appropriate controller
###

### Authentication
# Check user, create token, redirect

@routes.route('/login', methods=['POST'])
def loginUser():
    print("asdasdsa")
    return auth.authUser()

# Boolean to check whether the current user is authenticated or not
@routes.route('/hasAuth', methods=['GET'])
@jwt_required
def checkAuth():
  try:
    token = request.headers.get('Authorization')
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200
  except:
    return jsonify({'ok': False, 'message': 'invalid username or password'}), 401

# Revoke accessToken and put insert it into the blacklist
@routes.route('/logoutAccessToken', methods=['DELETE'])
@jwt_required
def logoutAccessToken():
    return auth.logout()

# See if token is in blacklist already
@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    return auth.checkIfTokenInBlackList(decrypted_token)

### User

# Get, create, update a single user
@routes.route('/user', methods = ['POST', 'GET', 'PUT'])
def userControl():
    if request.method == 'POST':
        return user.createUser()
    if request.method == 'GET':
        return user.getUserDetails()
    if request.method == 'PUT':
        return user.updateUser()

@routes.route('/changeEmail', methods = ['PUT'])
@jwt_required
def changeEmail(): 
    return user.changeEmail()

@routes.route('/checkPassword', methods = ['POST'])
@jwt_required
def checkPassword():
    return user.checkPassword()
    
@routes.route('/changePassword', methods = ['PUT'])
@jwt_required
def changePassword():
    return user.changePassword()

@routes.route('/updateUserHistory', methods = ['PUT'])
@jwt_required
def updateUserHistory():
    return user.updateUserHistory()    

@routes.route('/removeFromUserHistory', methods = ['DELETE'])
@jwt_required
def removeFromUserHistory():
    return user.removeFromUserHistory()   
    
###

### Recipes

# Get, create, update, delete a single job

@routes.route('/recipe', methods = ['POST', 'GET', 'PUT', 'DELETE'])
@jwt_required
def longrunningtaskControl():
    if request.method == 'POST':
        return recipe.createRecipe()
    if request.method == 'GET':
        return recipe.getRecipe()
    if request.method == 'PUT':
        return recipe.updateRecipe()
    if request.method == 'DELETE':
        return recipe.deleteRecipe()
        
###

### Tags

# Create a single tag or get an array of them

@routes.route('/tag', methods = ['POST', 'GET'])
@jwt_required
def tagControl():
    if request.method == 'POST':
        return tag.createTag()
    if request.method == 'GET':
        return tag.searchTag()
        
###


### Ingredients

# Create a single ingredient or get an array of them

@routes.route('/ingredient', methods = ['POST', 'GET'])
@jwt_required
def ingredientControl():
    if request.method == 'POST':
        return ingredient.createIngredient()
    if request.method == 'GET':
        return ingredient.searchIngredient()
        
###


### Unit

# Create a single unit or get an array of them

@routes.route('/unit', methods = ['POST', 'GET'])
@jwt_required
def unitControl():
    if request.method == 'POST':
        return unit.createUnit()
    if request.method == 'GET':
        return unit.searchUnit()
        
###


### Upload
@routes.route('/upload', methods = ['POST', 'DELETE'])
@jwt_required
def uploadControl():
    if request.method == 'POST':
        return upload.uploadFile()
    if request.method == 'DELETE':
        return upload.deleteFile()
###


### Mail

@routes.route('/mail', methods = ['POST', 'GET', 'PUT', 'DELETE'])
def mailControl():
    if request.method == 'GET':
      #msg = Message("Hello", sender="sender@sender.com", recipients=["recipient@recipient.com"])
      #mail.send(msg)
    
      return jsonify({'ok': True, 'message': 'Route is working'}), 200
###