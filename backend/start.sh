pkill redis-server
pkill -f "manage.py runserver"
pkill -f "celery"

echo "starting django..."
python manage.py runserver &

echo "starting redis..."
redis-server &

echo "starting celery..."
celery -A backend worker --loglevel=info
