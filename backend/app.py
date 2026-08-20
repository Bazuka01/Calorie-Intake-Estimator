from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import requests
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

USDA_API_KEY = os.getenv("USDA_API_KEY")
USDA_API_URL = "https://api.nal.usda.gov/fdc/v1/foods/search"


@app.route("/")
def home():
    return "Calorie Intake Estimator backend is running!"


@app.route("/nutrition")
def nutrition():
    food = request.args.get("food")

    if not food:
        return jsonify({"error": "No food provided"}), 400

    response = requests.get(
        USDA_API_URL,
        params={
            "api_key": USDA_API_KEY,
            "query": food,
            "pageSize": 20
        }
    )

    if not response.ok:
        return jsonify({"error": "USDA API request failed"}), 500

    data = response.json()

    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)