# Phonebook AI
Contacts manager with AI assistant built in!

## Starting
First copy `.env.example` file to `.env` and modify it:
- `PORT` - Port on which whole application will be running,
- `ORIGIN_URL` - Only needed when want to run under domain url. This domain will be added to CSRF whitelist.
- `OPENAI_API_KEY` - OpenAI API key
- `LANGSMITH_API_KEY` - Optional. To enable tracing.

After preparing `.env` file execute `docker compose up --build` and everything should be running.
