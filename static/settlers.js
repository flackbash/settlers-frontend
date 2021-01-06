// ---------------------- Global variables -------------------------------------
// URL building
var basePath = window.location.pathname.replace(/\/$/, "") + "/";
var URL_DRAW_RESOURCE = basePath + "draw_resource_card";
var URL_DISCARD_RESOURCE = basePath + "discard_resource_card";
var URL_ROLE_DICE = basePath + "get_dice_roll";
var URL_ROAD_POSITION_CLICKED = basePath + "road_position_clicked";
var URL_SETTLEMENT_POSITION_CLICKED = basePath + "settlement_position_clicked";

// Player variables
// TODO: Adjust player id. Where to store it?
var player_id = "p1";

// Token placement variables
var token_selected = '';  // one of: road, settlement, city

/*
 * Select a token.
 */
function toggleSelectToken(type, element) {
  if (token_selected) {
    // Remove class 'selected' from previously selected token
    $('.token.' + token_selected).each(function(i, obj){
      $(obj).removeClass('selected');
    });
    // Remove class 'selectable' from all targets of previously selected type
    $('.target.' + token_selected).each(function(i, obj){
      $(obj).removeClass('selectable');
    });
  }

  // Toggle selection
  if (token_selected != type) {
    token_selected = type;
    $(element).addClass('selected');
      $('.target.' + type).each(function(i, obj){
        $(obj).addClass('selectable');
      });
  } else {
    token_selected = '';
  }
}

/*
 * Send request to server to draw a resource card and display result.
 */
function drawResourceCard(type) {
  var params = {"type": type, "player_id": player_id};
  params = $.param(params);

  var url = URL_DRAW_RESOURCE + "?" + params;

  $.getJSON(url, function(jsonObj) {
    if (jsonObj.length == 0) return;

    var success = jsonObj["success"];

    if (success == "true") {
        // Increase the resource card number of the corresponding type by one
        var numberObject = $('.resource-card.' + type + ' .number');
        var currNumber = parseInt(numberObject.html());
        numberObject.html(currNumber + 1);
    }
  });
}

/*
 * Send request to server to discard a resource card and display result.
 */
function discardResourceCard(type) {
  var params = {"type": type, "player_id": player_id};
  params = $.param(params);

  var url = URL_DISCARD_RESOURCE + "?" + params;

  $.getJSON(url, function(jsonObj) {
    if (jsonObj.length == 0) return;

    var success = jsonObj["success"];

    if (success == "true") {
        // Decrease the resource card number of the corresponding type by one
        var numberObject = $('.resource-card.' + type + ' .number');
        var currNumber = parseInt(numberObject.html());
        if (currNumber > 0) {
            numberObject.html(currNumber - 1);
        }
    }
  });
}

/*
 * Send request to server to role the dice and display result.
 */
function roleDice() {
  var url = URL_ROLE_DICE;

  $.getJSON(url, function(jsonObj) {
    if (jsonObj.length == 0) return;

    var result1 = jsonObj["result1"];
    var result2 = jsonObj["result2"];

    // Display the dice roll
    var die1 = $('#die1');
    var img1 = getDieImageUrl(result1);
    console.log(img1);
    die1.css('background-image', 'url(' + img1 + ')');
    var die2 = $('#die2');
    var img2 = getDieImageUrl(result2);
    die2.css('background-image', 'url(' + img2 + ')');
  });
}

/*
 * For a given number between 1 and 6 retrieve the correct die image url.
 */
function getDieImageUrl(number) {
    var baseUrl = "static/img/"
    var filename = "";
    switch (number) {
        case 1:
          filename = "one.png";
          break;
        case 2:
          filename = "two.png";
          break;
        case 3:
            filename = "three.png";
          break;
        case 4:
          filename = "four.png";
          break;
        case 5:
          filename = "five.png";
          break;
        case 6:
          filename = "six.png";
          break;
    }
    return baseUrl + filename;
}