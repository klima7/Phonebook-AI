from langgraph.prebuilt import create_react_agent
from langchain import hub

from conversations.models import Conversation
from agent.agents.tools import create_contact, delete_contact, update_contact, search_contacts

agent = create_react_agent(
    model="gpt-4o",  
    tools=[create_contact, delete_contact, update_contact, search_contacts],  
    # prompt=hub.pull("hwchase17/react")
)

def react_agent(conversation: Conversation):
    user_prompt = conversation.last_user_message().content

    for chunk in agent.stream(
        {"messages": [{"role": "user", "content": user_prompt}]}
    ):
        print("chunk", chunk, end="", flush=True)
