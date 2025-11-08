from strands import Agent
from strands_tools import calculator
from strands.models import BedrockModel

def analyse_data(data):
    model = BedrockModel(model_id="us.amazon.nova-micro-v1:0",
            max_tokens=1024,
            temperature=0.1,
            top_p=0.9)
    agent = Agent(
        model=model,
        system_prompt="You are a helpful assistant."
    )
    answer = agent("What is a makalu tiki?")
    return answer.message['content'][0]['text']