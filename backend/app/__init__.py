from flask import Flask

app = Flask(__name__)

app.debug = True

@app.route("/")
def hello_world():
    return "<h2>hello!!</h2>"