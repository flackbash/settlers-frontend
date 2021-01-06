// ---------------------- Global variables -------------------------------------
// URL building
var basePath = window.location.pathname.replace(/\/$/, "") + "/";
var URL_DRAW_RESOURCE = basePath + "draw_resource_card";
var URL_DISCARD_RESOURCE = basePath + "discard_resource_card";
var URL_ROLE_DICE = basePath + "get_dice_roll";
var URL_ROAD_POSITION_CLICKED = basePath + "select_road_position";
var URL_SETTLEMENT_POSITION_CLICKED = basePath + "select_settlement_position";

// Player variables
// TODO: Adjust player id and color. Where to store it and how to retrieve it?
var playerId = "p1";
var playerColor = "blue";

// Token placement variables
var selectedToken = '';  // one of: road, settlement, city

// Possible player colors
var playerColorList = ["blue", "red", "yellow", "green"]

/*
 * Select a token.
 */
function toggleSelectToken(type, element) {
  if (selectedToken) {
    // Remove class 'selected' from previously selected token
    $('.token.' + selectedToken).each(function(i, obj){
      $(obj).removeClass('selected');
    });
    // Remove class 'selectable' from all targets of previously selected type
    $('.hex .' + selectedToken).each(function(i, obj){
      $(obj).removeClass('selectable');
    });
  }

  // Toggle selection
  if (selectedToken != type) {
    selectedToken = type;
    $(element).addClass('selected');
      $('.hex .' + type).each(function(i, obj){
        $(obj).addClass('selectable');
      });
  } else {
    selectedToken = '';
  }
}

/*
 * Send request to server to draw a resource card and display result.
 */
function drawResourceCard(type) {
  var params = {"type": type, "player_id": playerId};
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
  var params = {"type": type, "player_id": playerId};
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

$(document).ready(function(){

  // OnClickListener for roads (targets and existing roads)
  $(".hex .road").click(function(){
    if (selectedToken != 'road') {
      return;
    }
    // Get x and y coordinates of the road
    var id = $(this).parent().attr('id');
    var coords = id.split("_");
    var x = parseInt(coords[0]);
    var y = parseInt(coords[1]);

    // Get offset
    var classList = $(this).attr('class').split(/\s+/);
    var possibleOffsets = ["tl", "l", "tr"];
    var offset = "";
    possibleOffsets.forEach(function(offs) {
      if (jQuery.inArray(offs, classList) != -1) {
        offset = offs;
      }
    });

    // Prepare parameters for request to server
    var params = {"x": x, "y": y, "offset": offset, "player_id": playerId};
    params = $.param(params);

    var url = URL_ROAD_POSITION_CLICKED + "?" + params;

    $.getJSON(url, function(jsonObj) {
      var resX = jsonObj["x"];
      var resY = jsonObj["y"];
      var resOffset = jsonObj["offset"];
      // TODO: Deal with player id
      var resPlayerId = jsonObj["player_id"];
      console.log("result: " + resX + ", " + resY + ", " + resOffset + ", " + resPlayerId);

      // Display road or road target at specified position.
      var hexId = resX + "_" + resY;
      var roadObj = $("#" + hexId).children(".road." + resOffset)
      if (resPlayerId != null) {
        console.log("Add road");
        roadObj.removeClass("target");
        roadObj.addClass(playerColor);
      } else {
        console.log("Remove road");
        roadObj.addClass("target");
        roadObj.addClass("selectable");
        playerColorList.forEach(function(color) {
          roadObj.removeClass(color)
        });
      }
    });
  });
});
