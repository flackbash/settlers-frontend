// ---------------------- Global variables -------------------------------------
var basePath = window.location.pathname.replace(/\/$/, "") + "/";
var URL_PREFIX_DRAW_RESOURCE = basePath + "draw_resource_card?";

// TODO: Adjust player id. Where to store it?
var player_id = 0;

/*
 * Send request to server to draw a resource card
 */
function drawResource(type) {
  var url = URL_PREFIX_QAC + type;
  $.getJSON(url, function(jsonObj) {
    // Bail early if the result is empty
    if (jsonObj.length == 0) return;

    var success = jsonObj["success"];

    if (success == true) {
        console.log("Drew a card of type " + type);
    }
  }
}
