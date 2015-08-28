angular
  .module('stamplayApp', ['ngStamplay', 'SuggestionService', 'UserService'])
  .controller('MainController', MainController);
  
  
function MainController(Suggestion, User) {
  
  var main = this;
  main.suggestionData = {};   // blank object to hold data from suggestion form
  main.loggedUser = {};       // blank object to hold logged in user data

  // ========================================
  // function to logout a user
  // ========================================
  main.logout = function() {
    User.logout();
  };

  // ========================================
  // get current user =======================
  // ========================================
  User.getCurrent()
    .then(function(data) {
      if (data.get('_id')) {
        main.loggedIn = true;
        main.loggedUser.userId = data.get('_id');
        main.loggedUser.displayName = data.get('displayName');
        main.loggedUser.profileImg = data.get('profileImg');   
      } else {
        main.loggedIn = false;
      }
        
    });

  // ========================================
  // get all suggestions
  // ========================================
  Suggestion.getAll()
    .then(function(data) {
      main.suggestionList = data.instance;
    });

  // ========================================
  // submit a suggestion ====================
  // ========================================
  main.submitSuggestion = function(id, formData) {

    Suggestion.create(id, formData)
      .then(function(data) {

        // clear the form
        main.suggestionData = {};

        // get all the suggestions again
        Suggestion.getAll()
          .then(function(data) {
            main.suggestionList = data.instance;
          });
      });    
  };

  // ========================================
  // vote on a suggestion
  // ========================================
  main.vote = function(suggestion, type) {

    Suggestion.vote(suggestion.instance._id, type)
      .then(function() {
        // update the suggestions
        Suggestion.getAll()
          .then(function(data) {

            // if the vote was successful, update the UI
            if (type == 'upvote') {
              suggestion.instance.actions.votes.total++;
              suggestion.instance.actions.votes.upvoted = true;
              suggestion.instance.actions.votes.downvoted = false;
            } else if (type == 'downvote') {
              suggestion.instance.actions.votes.total--;
              suggestion.instance.actions.votes.downvoted = true;
              suggestion.instance.actions.votes.upvoted = false;
            }

            main.suggestionList = data.instance;
          });
      });
  };
  
}