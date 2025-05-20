from flask import Flask, render_template, jsonify, send_from_directory, request
from flask_cors import CORS
import sys
import os

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

# Import the Flask app from app.py
from app import app

def handler(event, context):
    """Handle requests to the Flask application"""
    return app(event, context) 