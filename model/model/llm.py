from typing import Dict
from langchain_core.language_models import LanguageModelInput
from langchain_ollama import ChatOllama

class LLMManager:
    def __init__(self, main_model="Llama-3-Groq-70B-Tool-Use"):
        self.main_llm = ChatOllama(model=main_model, temperature=0)

    def invoke(
            self,
            prompt: LanguageModelInput
    ) -> Dict:
        """Invoke the LLM with the given prompt and return the response."""
        return {"messages": [self.main_llm.invoke(prompt)]}
