from flask import Flask
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    Config.init_app(app)
    
    from app.routes import configure_routes
    configure_routes(app)
    
    return app