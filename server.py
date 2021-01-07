import argparse
import json
from flask import Flask, render_template, request

from src.settlers_server.src.settlers.settlement_board import SettlementBoard
from src.settlers_server.src.settlers.street_board import StreetBoard
from src.settlers_server.src.settlers.table import Table
from src.settlers_server.src.settlers.dice import roll_two_dice

app = Flask(__name__)

default_response = json.dumps('{"test": "ok"}')

players = ["p1", "p2", "p3"]
table = Table(players)
street_board = StreetBoard(players)
settlement_board = SettlementBoard(players)
dice_result = (0,0)


@app.route("/")
def home():
    return render_template("settlers.html")


@app.route('/get_dice_roll')
def get_dice_roll():
    dice_result = roll_two_dice()
    json_response = json.dumps({"result1": dice_result[0], "result2": dice_result[1]})
    return json_response


@app.route('/draw_development_card')
def draw_development_card():
    player_id = request.args.get("player_id")
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
    increment = 1
    result = table.change_resource_amount(player_id, resource_type, increment)
    return json.dumps(result)


@app.route('/discard_resource_card')
def discard_resource_card():
    player_id = request.args.get("player_id")
    resource_type = request.args.get("type")
    increment = -1
    result = table.change_resource_amount(player_id, resource_type, increment)
    return json.dumps(result)


@app.route('/select_road_position')
def select_road_position():
    player_id = request.args.get("player_id")
    x = int(request.args.get("x"))
    y = int(request.args.get("y"))
    offset = request.args.get("offset")
    result = street_board.position_selected(player_id, (x,y,offset))
    return json.dumps(result)


@app.route('/select_settlement_position')
def select_settlement_position():
    player_id = request.args.get("player_id")
    x = int(request.args.get("x"))
    y = int(request.args.get("y"))
    offset = request.args.get("offset")
    settlement_type = request.args.get("type")
    result = settlement_board.position_selected(player_id, (x,y,offset), settlement_type)
    return json.dumps(result)


if __name__ == "__main__":
    # Parse command line arguments
    parser = argparse.ArgumentParser()
    parser.add_argument("port", type=int,
                        help="Specify port on which to run the server")

    args = parser.parse_args()

    app.run(threaded=True, host="::", port=args.port, debug=False)
