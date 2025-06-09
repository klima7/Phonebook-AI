# Phonebook AI
Contacts manager with AI assistant built in!

## Starting
First copy `.env.example` file to `.env` and modify it:
- `PORT` - Port on which whole application will be running,
- `ORIGIN_URL` - Only needed when want to run under domain url. This domain will be added to CSRF whitelist.
- `OPENAI_API_KEY` - OpenAI API key
- `LANGSMITH_API_KEY` - Optional. To enable tracing.

After preparing `.env` file execute `docker compose up --build` and everything should be running.

## URLs
- `http://localhost:<PORT>/` - Main interface (frontend)
- `http://localhost:<PORT>/api/admin` - Administrator panel (django admin)
- `http://localhost:<PORT>/tasks` - Background tasks monitoring (celery flower)

## Technological stack
This is frontend-backend application. Frontend is created with `React` (nodejs) and backend with `Django`. All realtime communication between backend and frontend is performed using `WebSockets`, called Channel on backend side. All async, background tasks are executed using `Celery`. Data is stored in `PostgreSQL` database. Also `Weaviate` is used for storing and searching embedding vectors. AI agent is implemented with `LangGraph`. Persisting LangGraph conversation state is implemented using Checkinting mechanism, which stores agent state in separate `PostgreSQL` database.
