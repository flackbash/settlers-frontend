// ---------------------- Global variables -------------------------------------
// URL building
var basePath = window.location.pathname.replace(/\/$/, "") + "/";
var URL_DRAW_RESOURCE = basePath + "draw_resource_card";
var URL_DRAW_DEVELOPMENT = basePath + "draw_development_card";
var URL_DISCARD_RESOURCE = basePath + "discard_resource_card";
var URL_DISCARD_DEVELOPMENT = basePath + "play_development_card";
var URL_ROLE_DICE = basePath + "get_dice_roll";
var URL_ROAD_POSITION_CLICKED = basePath + "select_road_position";
var URL_SETTLEMENT_POSITION_CLICKED = basePath + "select_settlement_position";

// Player variables
// TODO: Adjust player id and color. Where to store it and how to retrieve it?
var playerId = "p1";
var playerColor = "blue";

// Token placement variables
var selectedToken = '';  // one of: road, village, city

// Possible player colors
var playerColorList = ["blue", "red", "yellow", "green"]


/*
 * Send request to server to draw a resource card and display result.
 */
function drawResourceCard(type) {
  var params = {"type": type, "player_id": playerId};
  params = $.param(params);

  var url = URL_DRAW_RESOURCE + "?" + params;

  $.getJSON(url, function(jsonObj) {
    if (jsonObj.length == 0) return;

    // Display new amount of the resource card
    var newAmount = jsonObj[type];
    var numberObject = $('.resource-card.' + type + ' .number');
    numberObject.html(newAmount);
  });
}

/*
 * Send request to server to draw a development card and display result.
 */
function drawDevelopmentCard() {
  var params = {"player_id": playerId};
  params = $.param(params);

  var url = URL_DRAW_DEVELOPMENT + "?" + params;

  $.getJSON(url, function(jsonObj) {
    if (jsonObj.length == 0) return;

    // Display new amount of the development card
    var type = Object.keys(jsonObj)[0];
    var newAmount = jsonObj[type];
    var numberObject = $('.resource-card.' + type + ' .number');
    numberObject.html(newAmount);
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

    // Display new amount of the resource card
    var newAmount = jsonObj[type];
    var numberObject = $('.resource-card.' + type + ' .number');
    numberObject.html(newAmount);
  });
}

/*
 * Send request to server to discard a development card and display result.
 */
function discardDevelopmentCard(type) {
  var params = {"type": type, "player_id": playerId};
  params = $.param(params);

  var url = URL_DISCARD_DEVELOPMENT + "?" + params;

  $.getJSON(url, function(jsonObj) {
    if (jsonObj.length == 0) return;

    // Display new amount of the development card
    var newAmount = jsonObj[type];
    var numberObject = $('.resource-card.' + type + ' .number');
    numberObject.html(newAmount);
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

/*
 * Select a token.
 */
function toggleSelectToken(type, element) {
  var prevSelectedTargetClass = selectedToken;
  if (selectedToken == 'village' || selectedToken == 'city') {
    prevSelectedTargetClass = 'settlement';
  }

  var newSelectedTargetClass = type;
  if (type == 'village' || type == 'city') {
    newSelectedTargetClass = 'settlement';
  }

  if (selectedToken) {
    // Remove class 'selected' from previously selected token
    $('.token.' + selectedToken).each(function(i, obj){
      $(obj).removeClass('selected');
    });
    // Remove class 'selectable' from all targets of previously selected type
    $('.hex .' + prevSelectedTargetClass).each(function(i, obj){
      $(obj).removeClass('selectable');
    });
  }

  // Toggle selection
  if (selectedToken != type) {
    selectedToken = type;
    $(element).addClass('selected');
      $('.hex .' + newSelectedTargetClass).each(function(i, obj){
        $(obj).addClass('selectable');
      });
  } else {
    selectedToken = '';
  }
}

function getCoordinates(element) {
  // Get x and y coordinates
  var id = $(element).parent().attr('id');
  var coords = id.split("_");
  var x = parseInt(coords[0]);
  var y = parseInt(coords[1]);

  // Get offset
  var classList = $(element).attr('class').split(/\s+/);
  var possibleOffsets = ["tl", "l", "tr", "t"];
  var offset = "";
  possibleOffsets.forEach(function(offs) {
    if (jQuery.inArray(offs, classList) != -1) {
      offset = offs;
    }
  });

  return {"x": x, "y": y, "offset": offset};
}

$(document).ready(function(){

  // OnClickListener for roads (targets and existing roads)
  $(".hex .road").click(function(){
    if (selectedToken != 'road') {
      return;
    }

    // Retrieve coordinates of the clicked object and prepare parameters
    var params = getCoordinates(this);
    params["player_id"] = playerId;
    params = $.param(params);

    var url = URL_ROAD_POSITION_CLICKED + "?" + params;

    $.getJSON(url, function(jsonObj) {
      var resX = jsonObj["x"];
      var resY = jsonObj["y"];
      var resOffset = jsonObj["offset"];
      // TODO: Deal with player id
      var resPlayerId = jsonObj["player_id"];

      // Display road or road target at specified position.
      var hexId = resX + "_" + resY;
      var roadObj = $("#" + hexId).children(".road." + resOffset)
      if (resPlayerId != null) {
        roadObj.removeClass("target");
        roadObj.addClass(playerColor);
      } else {
        roadObj.addClass("target");
        roadObj.addClass("selectable");
        playerColorList.forEach(function(color) {
          roadObj.removeClass(color)
        });
      }
    });
  });

  // OnClickListener for settlements (targets and existing settlements)
  $(".hex .settlement").click(function(){
    if (selectedToken != "village" && selectedToken != "city") {
      return;
    }

    // Retrieve coordinates of the clicked object and prepare parameters
    var params = getCoordinates(this);
    params["player_id"] = playerId;
    params["type"] =  selectedToken
    params = $.param(params);

    var url = URL_SETTLEMENT_POSITION_CLICKED + "?" + params;

    $.getJSON(url, function(jsonObj) {
      var resX = jsonObj["x"];
      var resY = jsonObj["y"];
      var resOffset = jsonObj["offset"];
      // TODO: Deal with player id
      var resPlayerId = jsonObj["player_id"];
      var resType = jsonObj["type"];

      // Display settlement/city or target at specified position.
      var hexId = resX + "_" + resY;
      var settlementObj = $("#" + hexId).children(".settlement." + resOffset)
      if (resPlayerId != null) {
        settlementObj.removeClass("target");
        settlementObj.addClass(playerColor);
        if (resType == "city") {
          settlementObj.addClass("city");
        } else {
          settlementObj.removeClass("city");
        }
      } else {
        settlementObj.addClass("target");
        settlementObj.addClass("selectable");
        settlementObj.removeClass("city");
        playerColorList.forEach(function(color) {
          settlementObj.removeClass(color)
        });
      }
    });
  });
});
