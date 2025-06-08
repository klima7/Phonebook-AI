from langgraph.prebuilt import create_react_agent
from langchain import hub

from conversations.models import Conversation, Message, MessageType
from agent.agents.tools import create_contact, delete_contact, update_contact, search_contacts

agent = create_react_agent(
    model="gpt-4o",  
    tools=[create_contact, delete_contact, update_contact, search_contacts],  
)

def react_agent(conversation: Conversation):
    user_prompt = conversation.last_user_message().content

    for chunk in agent.stream(
        {"messages": [{"role": "user", "content": user_prompt}]}
    ):
        print("chunk", chunk, end="", flush=True)
        
        if "agent" in chunk:
            messages = chunk["agent"]["messages"]
            for message in messages:
                if message.content.strip():
                    Message.objects.create(
                        conversation=conversation,
                        content=message.content,
                        type=MessageType.ASSISTANT,
                    )
