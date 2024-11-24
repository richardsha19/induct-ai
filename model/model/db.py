import ollama
import chromadb

class VectorDB:
    def __init__(self):
        self.client = chromadb.Client()
        self.collection = self.client.create_collection(name="docs")

    def add_embeddings(self, documents):
        """Generate embeddings for a list of documents and store them in the collection."""
        for i, d in enumerate(documents):
            response = ollama.embeddings(model="mxbai-embed-large", prompt=d)
            embedding = response["embedding"]
            self.collection.add(
                ids=[str(i)],
                embeddings=[embedding],
                documents=[d]
            )

    def retrieve(self, prompt):
        """Retrieve the most relevant document for a given prompt."""
        response = ollama.embeddings(
            prompt=prompt,
            model="mxbai-embed-large"
        )
        results = self.collection.query(
            query_embeddings=[response["embedding"]],
            n_results=1
        )
        return results['documents'][0][0]

    def generate_response(self, prompt, data):
        """Generate a response using the prompt and retrieved data."""
        output = ollama.generate(
            model="llama3.2",
            prompt=f"Using this data: {data}. Respond to this prompt: {prompt}"
        )
        return output['response']

    def RAG(self, documents, prompt):
        """Perform the full retrieval process: generate embeddings, retrieve document, and generate response."""
        self.add_embeddings(documents)
        data = self.retrieve(prompt)
        response = self.generate_response(prompt, data)
        return response

# Example usage
if __name__ == "__main__":
    documents = [
        "Llamas were first domesticated and used as pack animals 4,000 to 5,000 years ago in the Peruvian highlands",
        "Llamas can grow as much as 6 feet tall though the average llama between 5 feet 6 inches and 5 feet 9 inches tall",
        "Llamas weigh between 280 and 450 pounds and can carry 25 to 30 percent of their body weight",
        "Llamas are vegetarians and have very efficient digestive systems",
        "Llamas live to be about 20 years old, though some only live for 15 years and others live to be 30 years old",
    ]

    vector_db = VectorDB()
    prompt = "What animals are llamas related to?"
    response = vector_db.RAG(documents, prompt)

    print(response)
