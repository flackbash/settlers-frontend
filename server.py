import argparse
from flask import Flask, render_template


app = Flask(__name__)


@app.route("/")
def home():
    return render_template("settlers.html")


if __name__ == "__main__":
    # Parse command line arguments
    parser = argparse.ArgumentParser()
    parser.add_argument("port", type=int,
                        help="Specify port on which to run the server")

    args = parser.parse_args()

    app.run(threaded=True, host="::", port=args.port, debug=False)
