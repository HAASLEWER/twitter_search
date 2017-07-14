var g_tweets = [];

// Inject pace to indicate ajax loading requests
$(document).ajaxStart(function() { 
  Pace.restart(); 
});

$(document).ready(function() {

  // Use ajax to search for the hashtag
  $("#search_form").submit(function(e) {  
      // Define our search route
      var url = "/search";

      // Get the hashtag and create the payload
      var payload = JSON.stringify( {hashtag: $("#search").val()} );           

      // Send our request
      Pace.track(function(){      
        $.ajax({
          type: "POST",
          contentType: "application/json",
          url: url,
          data: payload,
          success: function(data) { 
            addTweets(data.result.statuses, false);
          },
          error: function(data) { // An error occurred, inform the user
            Materialize.toast('Error retrieving tweets.', 4000);
            console.log(data);
          }            
        });

        e.preventDefault(); // Prevent the page from reloading after the submit, because ajax ;-)
    });
  });

  // Add the tweets returned from the api to the page
  function addTweets(tweets, read_later) {
    g_tweets = tweets;
   
    // Check if no statusses were found, notify the user
    if (tweets.length == 0) {
      $('.dynamic_content').html('<h1 class="center-align flow-text">No tweets could be found, try #fail ;-)</h1>');
      return;
    }

    // Setup card
    $('.dynamic_content').html('<div class="row"></div>');

    tweets.forEach(function(status) {
      // Switch the button based on wheter we're searching or viewing read later
      if (read_later) {
        var floating_button = '<a class="btn-floating halfway-fab waves-effect waves-light red delete-button tooltipped" tweet_id="' +  status.id + '"><i class="material-icons">delete</i></a>';
      } else {
        var floating_button = '<a class="btn-floating halfway-fab waves-effect waves-light red save-button tooltipped" tweet_id="' +  status.id + '"><i class="material-icons">add</i></a>';
      }

      // Remove _normal from the profile image url to get the full resolution image
      status.user.profile_image_url = status.user.profile_image_url.replace("_normal", "");
      var card = '<div class="col l2 m3 s12">' + 
                    '<div class="card medium">' + 
                      '<div class="card-image">' + 
                        '<img src="' + status.user.profile_image_url + '">' + 
                        '<span class="card-title">' + status.user.name + '</span>' +  
                      '</div>' + 
                      floating_button + 
                      '<div class="card-content">' + 
                        '<p flow-text>' + status.text + '</p>' + 
                      '</div>' + 
                    '</div>' + 
                  '</div>';

      try {
        $('.dynamic_content .row').append(card);
      } catch(err) {
        console.log("Error adding tweet: " + err);
      }

      // Init tooltip
      $('.tooltipped').tooltip({
        delay: 50,
        position: "right",
        tooltip: "Add to read later"
      });            
    });    
  }

  // Save the tweet to the read later database
  $(document).on("click", ".save-button", function() {   
    // Get the clicked tweet id
    var tweet_id = $(this).attr("tweet_id"); 
    // Get the tweet from the tweets returned from the search  
    var tweet_to_save = _.find(g_tweets, function(tweet) { return parseInt(tweet_id) == tweet.id });

    // Ensure a tweet was found
    if (tweet_to_save) {
      // Define our save route
      var url = "/save";

      // Get the hashtag and create the payload
      var payload = JSON.stringify({tweet: {id: tweet_to_save.id, user: tweet_to_save.user, text: tweet_to_save.text}});   

      // Save the tweet to the database
      Pace.track(function(){      
        $.ajax({
          type: "POST",
          contentType: "application/json",
          url: url,
          data: payload,
          success: function(data) { 
            Materialize.toast('Tweet added to read later successfully.', 4000);
          },
          error: function(data) { // An error occurred, inform the user
            Materialize.toast('Error adding to read later: Tweet could not be saved.', 4000);
            console.log(data);
          }            
        }); 
      });     
    } else {
      Materialize.toast('Error adding to read later: Tweet data could not be found.', 4000);
    }
  });  

  // Get the tweets saved to the read later list
  $(document).on("click", ".read-later", function() { 
    // Define our read later route
    var url = "/save";

    Pace.track(function(){      
      $.ajax({
        type: "GET",
        contentType: "application/json",
        url: url,
        success: function(data) { 
          // Remove the first level of the array so that it matches the twitter api return payload
          tweets = _.map(data.result, function(val) {  
            return val
          }); 
     
          addTweets(tweets, true);
        },
        error: function(data) { // An error occurred, inform the user
          Materialize.toast('Error getting read later list.', 4000);
          console.log(data);
        }            
      }); 
    });    
  });

  // Delete a saved tweet
  $(document).on("click", ".delete-button", function() { 
    // Get the clicked tweet id
    var tweet_id = $(this).attr("tweet_id"); 

    // Specify our delete path
    var url = "/delete/" + tweet_id;

    if (tweet_id) {
      Pace.track(function(){      
        $.ajax({
          type: "DELETE",
          contentType: "application/json",
          url: url,
          success: function(data) { 
            Materialize.toast('Tweet deleted successfully.', 4000); 
            $(".read-later").click();
          },
          error: function(data) { // An error occurred, inform the user
            Materialize.toast('Error deleting tweet.', 4000);
            console.log(data);
          }            
        }); 
      });
    } else {
      Materialize.toast('Error deleting tweet: Tweet id could not be found.', 4000);
    }
  });  

});