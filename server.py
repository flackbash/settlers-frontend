import argparse
import json
from flask import render_template, request

# Append the server module to the sys path to be able to use it here.
import sys
import pathlib
parent_dir = pathlib.Path(__file__).parent.absolute()
sys.path.append(str(parent_dir / "src/settlers_server/src"))
from backend import app


app.root_path = parent_dir


@app.route("/")
def home():
    return render_template("settlers.html")


if __name__ == "__main__":
    # Parse command line arguments
    parser = argparse.ArgumentParser()
    parser.add_argument("port", type=int,
                        help="Specify port on which to run the server")

    args = parser.parse_args()

    app.run(threaded=True, host="::", port=args.port, debug=True)
