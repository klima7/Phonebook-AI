# Phonebook AI
Contacts manager with AI assistant built in!

Deployed application should be available under [https://phonebook.ukasz.com](https://phonebook.ukasz.com)

## Starting
First copy `.env.example` file to `.env` and modify it:
- `PORT` - Port on which whole application will be running,
- `ORIGIN_URL` - Only needed when want to run under domain url. This domain will be added to CSRF whitelist.
- `OPENAI_API_KEY` - OpenAI API key
- `LANGSMITH_API_KEY` - Optional. To enable tracing.

After preparing `.env` file execute `docker compose up --build` and everything should be running.

Application directory is mounted into containers inside docker-compose and it should hot-reload after detecting changes.

## URLs
- `http://localhost:<PORT>/` - Main interface (frontend)
- `http://localhost:<PORT>/api/admin` - Administrator panel (django admin)
- `http://localhost:<PORT>/tasks` - Background tasks monitoring (celery flower)

## Technological stack
This is frontend-backend application. Frontend is created with `React` (nodejs) and backend with `Django`. All realtime communication between backend and frontend is performed using `WebSockets`, called Channel on backend side. All async, background tasks are executed using `Celery`. Data is stored in `PostgreSQL` database. Also `Weaviate` is used for storing and searching embedding vectors. AI agent is implemented with `LangGraph`. Persisting LangGraph conversation state is implemented using Checkinting mechanism, which stores agent state in separate `PostgreSQL` database.

## Tools available to Agent
- **create_contact** - Creates a new contact with name and phone number
- **delete_contact** - Deletes an existing contact by ID
- **update_contact** - Updates a contact's name and/or phone number
- **search_contacts** - Searches contacts by name using regex pattern matching
- **search_contacts_semantic** - Performs meaning-based search for contacts using vector embeddings

## Contacts semantic search
It works more or less. In addition to the standard embedding of names and storing them in a vector database for later searching, a "name augmentatikon" stage is added: using a short prompt to LLM, tags are generated for each contact name, for example, for the name “Kubuś” the tags “Kuba, male, child, boy” are generated and this reacher information is embedded.
