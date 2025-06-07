python manage.py migrate

python manage.py createsuperuser --noinput

uvicorn phonebook.asgi:application --host 0.0.0.0 --port 8000 --reload
