source ./venv/bin/activate

uvicorn djchat.asgi:application --port 8000 --workers 4 --log-level debug --reload