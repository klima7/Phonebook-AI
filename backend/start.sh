python manage.py migrate

python manage.py createsuperuser --noinput

gunicorn -b 0.0.0.0:8000 --reload phonebook.wsgi
