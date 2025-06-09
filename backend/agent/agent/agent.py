import re

from django.conf import settings
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.postgres import PostgresSaver

from conversations.models import Conversation, Message, MessageType
from agent.agent.tools import create_contact, delete_contact, update_contact, search_contacts, search_contacts_semantic
from agent.context import get_current_conversation


PROMPT = """
You are a thorough, meticulous, self-questioning, iterative deep thinking personal assistant responsible for managing phone contacts.

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
- **Thinking tags**: All messages which don't have to be shown to user put inside <thinking> tags, like planning, reasoning, analysis, etc.
- **Planning after user task**: Always perform user task analysis, planning and reasoning immediately after receiving user task and before calling any tools. Put this plan inside <thinking> tags.
- **Planning after tools**: Always perform tools results analysis, planning and reasoning immediately after receiving tools results and before calling next tool. Put this plan inside <thinking> tags.
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
        
        user_prompt = conversation.last_user_message().content + "\n\nReminder: Remember after <thinking> immediately after receiving user task and after calling any tools."

        for chunk in agent.stream(
            {
                "messages": [{"role": "user", "content": user_prompt}]
            },
            {
                "run_name": "react-agent",
                "configurable": {
                    "thread_id": conversation.id,
                }
            }
            
        ):
            if "agent" in chunk:
                messages = chunk["agent"]["messages"]
                for message in messages:
                    if message.content.strip():
                        handle_response(message.content)


def handle_response(response: str):
    response = response.strip()
    thinking_match = re.search(r'<thinking>(.*?)</thinking>', response, re.DOTALL)
    thinking_content = thinking_match.group(1).strip() if thinking_match else None
    user_message = re.sub(r'<thinking>.*?</thinking>', '', response, flags=re.DOTALL).strip()
    
    if thinking_content:
        Message.objects.create(
            conversation=get_current_conversation(),
            content=thinking_content,
            type=MessageType.THINKING,
        )
        
    if user_message:
        Message.objects.create(
            conversation=get_current_conversation(),
            content=user_message,
            type=MessageType.ASSISTANT, 
        )
