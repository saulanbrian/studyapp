# Backend (Django API)

This is the backend service for Cut D' Crop.
it's built with Django and Django Rest Framework,
and is the one responsible processing requests 
and task with realtome features using celery & channels.

## Table of Contents
1. [Prerequisites](#-prerequisites)
2. [Installation](#-installation-and-setup)
3. [API and Websocket connection](#-api-and-websocket-endpoints)

## Prerequisites
- Python 3.10+
- pip
- redis server
- rabbitmq server
- Clerk Application
- Gemini account 

## Installation and setup 
1. navigate to the backend directory 
( after cloning the repo )

2. Create and activate python environment
   - python -m venv env
     
   for macOS / linux:
   - source env/bin/activate
     
   for windows:
   - env\Scripts\activate
3. Install everything from requirements.txt
   - pip install -r requirements.txt
4. set environment variables for the following:
   Note: the given values are for development,
   use it if you're following this guide
   1. CELERY_BROKER_URL
      > amqp://guest:guest@localhost:5672//
   2. REDIS_URL
      > redis://localhost:6379/0
   3. CLERK_ISSUER
      > go to your clerk app dashboard -> configure -> API section
      and copy the Fronted API URL and paste it here
   4. CLERK_JWT_PUBLIC_KEY
      > navigate to the same directory where you get
      ClERK_ISSUER and copy the JWKS_PUBLIC_KEY
      and paste it here
   5. GEMINI_API_KEY
      > your Gemini api key
   6. SECRET_KEY
      > just put random characters 
5. go to settings.py and change the "DATABASES" with the
   value below:
    > DATABASES = {
       'default': {
          'ENGINE': 'django.db.backends.sqlite3',
          'NAME': BASE_DIR / 'db.sqlite3',
        }
      }
6. Run:
   - python manage.py migrate
   - python manage.py runserver
7. open another 3 terminals and run:
   - for celery
     > celery -A backend worker --loglevel=info
   - for redis
     > redis-server
   - for rabbitmq
     > rabbitmq-server
### Done!
 > backend is now ready to serve
### Important!!:
sometimes, realtime updates doesn't work
because celery tasks can't call redis on localhost.
if you run in this issue, just get a hosted redis-server 
and rabbitmq-server ( optional but guaranteed to work )

## API and WEBSCOKET ENDPOINTS

***Note***: endpoints are protected, 
so before sending a request, make sure 
you include Authorization Header with the
value of "Bearer { USER_TOKEN } ".
USER_TOKEN is retrieved in frontend using the 
getToken() method from clerk's useAuth() hook.
if you haven't make any change in the frontend,
every request is already configured to include
token so you don't really to worry about it as long as 
you're using the same clerk instance. 
> if you ever modify the frontend and make requests yourself,
just look at my custom hook: useAuthenticatedRequest and some
of my queries inside api/queries/ to understand how it works
( it's very understandable)

###### summary/

- /
  
> GET: this endpoints give all your summaries
> POST: endpoint to create a summary with these arguments:
> 
    1. file: the pdf file you want to summarize
    2. title: optional string to set as your summary title
    3. cover: optional image file to set as your summary cover
    
- favorites/
  
> this gives you all your favorite summaries

-  retry-summary/
  
> POST: if you're summary status turned out to be
  an error, send a post request to this url and provide
  a parameter called "id" with the value of the id of the summary.
  it will try to summarize it again

- [summary_id]/
  
> this api route accepts GET, PATCH, PUT, DELETE requests.
  just give the summary id so the url should be:
  summary/[summary_id]. summary_id is the summary you want to either
  update, retrieve, or delete

###### quiz/

- create/
  
> this endpoint is where you create a quiz for a
  given summary. just provide the paramater _summary_id_

- all/

> this endpoint basically gives you all the quizzes you currently have

- regenerate/

> same with _summary/retry-summary/_ but for quiz.
  just provide the parameterr _id_ for the quiz

- [summary_id]/

> same with summary/[summary_id]

### for our webscoket connection:
we only have one route and that route is
responsible for updating user. if you 
didn't make any change in our frontend, 
it automatically connects to it
so there's nothing to worry about it 
( at least for now )
