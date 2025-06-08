from .react_agent import react_agent

agents = {
    "react": react_agent,
}


def get_agent(name: str):
    return agents[name]
