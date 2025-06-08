from django.conf import settings
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.postgres import PostgresSaver

from conversations.models import Conversation, Message, MessageType
from agent.agents.tools import create_contact, delete_contact, update_contact, search_contacts, search_contacts_semantic


PROMPT = """
You are a helpfull personal assistant responsible for managing phone contacts.

# Your environment
You can create, delete, update, and search for contacts. Each contact has name, phone number and id.
**Name**: Must be unique. Do not have to be in any specific format.
**Phone number**: Is a text which may consist of numbers, spaces and other number phone special characters.

# Your behavior
- **Concise Answer**: Always respond concisely (1-2 sentences). User want to perform task quickly instead of chatting.
- **Stick to the task**: Answer only questions concerning contacts.
- **Do not reveal IDs**: Do not reveal IDs of contacts to the user.
- **Avoid asking for name**: Do not ask for name if user already provided some term which may be used, like family relation, company name, job title, hotel name, etc.
- **Avoid unnecessary search**: If user ask for creating contact do not search for it first.
- **Make sure search returned all results**: If search tool returned <limit> results then consider executing it again with offset to get all results.
"""


def react_agent(conversation: Conversation):
    
    with PostgresSaver.from_conn_string(settings.LANGGRAPH_DATABASE_URL) as checkpointer:
        checkpointer.setup()
        
        model = ChatOpenAI(model="gpt-4.1", temperature=0.0)
        
        agent = create_react_agent(
            model=model,
            prompt=PROMPT,
            tools=[
                create_contact,
                delete_contact,
                update_contact,
                search_contacts,
                search_contacts_semantic
            ],  
            checkpointer=checkpointer,
        )
        
        user_prompt = conversation.last_user_message().content

        for chunk in agent.stream(
            {
                "messages": [{"role": "user", "content": user_prompt}]
            },
            {
                "configurable": {
                    "thread_id": conversation.id,
                }
            }
            
        ):
            if "agent" in chunk:
                messages = chunk["agent"]["messages"]
                for message in messages:
                    if message.content.strip():
                        Message.objects.create(
                            conversation=conversation,
                            content=message.content,
                            type=MessageType.ASSISTANT,
                        )
