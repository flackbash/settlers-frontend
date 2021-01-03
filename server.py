import argparse
import json

from flask import Flask, render_template, request

from settlers_server.src.colonization.dice import roll_two_dice
from settlers_server.src.colonization.table import Table

app = Flask(__name__)

default_response = json.dumps('{"test": "ok"}')

table = Table(["p1", "p2", "p3"])


@app.route("/")
def home():
    return render_template("settlers.html")


@app.route('/get_dice_roll')
def get_dice_roll():
    result1, result2 = roll_two_dice()
    json_response = json.dumps({"result1": result1, "result2": result2})
    return json_response


@app.route('/draw_development_card')
def draw_development_card():
    player_id = request.args.get("player")
    text = table.draw_development_card(player_id)
    response = dict()
    response["development_card"] = dict()
    response["development_card"]["player_id"] = player_id
    response["development_card"]["text"] = text

    json_response = json.dumps(response)
    return json_response


@app.route('/draw_resource_card')
def draw_resource_card():
    player_id = request.args.get("player_id")
    resource_type = request.args.get("type")
    print("player_id: ", player_id)
    print("type: ", resource_type)
    table._hands[player_id].add_resource_card(resource_type)
    return json.dumps({"success": "true"})


@app.route('/discard_resource_card')
def discard_resource_card():
    player_id = request.args.get("player_id")
    resource_type = request.args.get("type")
    print("player_id: ", player_id)
    print("type: ", resource_type)
    return json.dumps({"success": "true"})


if __name__ == "__main__":
    # Parse command line arguments
    parser = argparse.ArgumentParser()
    parser.add_argument("port", type=int,
                        help="Specify port on which to run the server")

    args = parser.parse_args()

    app.run(threaded=True, host="::", port=args.port, debug=False)
