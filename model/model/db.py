import ollama
import chromadb
import os
from PyPDF2 import PdfReader
from docx import Document
import pandas as pd
from bs4 import BeautifulSoup

class VectorDB:
    def __init__(self):
        self.client = chromadb.Client()
        self.collection = self.client.create_collection(name="docs")

    def convert_to_text(self, file_path):
        _, file_extension = os.path.splitext(file_path)
        text = ""

        if file_extension == '.pdf':
            reader = PdfReader(file_path)
            for page in reader.pages:
                text += page.extract_text()

        elif file_extension == '.docx':
            doc = Document(file_path)
            for para in doc.paragraphs:
                text += para.text + "\n"

        elif file_extension in ['.xls', '.xlsx']:
            df = pd.read_excel(file_path)
            text = df.to_string()

        elif file_extension == '.html':
            with open(file_path, 'r', encoding='utf-8') as file:
                soup = BeautifulSoup(file, 'html.parser')
                text = soup.get_text()

        else:
            raise ValueError(f"Unsupported file type: {file_extension}")

        return text

    def parse_docs(self, path):
        if not os.path.exists(path):
            raise FileNotFoundError(f"The path {path} does not exist.")

        documents = []
        for file in os.listdir(path):
            file_path = os.path.join(path, file)
            if not file.endswith(".txt") and not file.endswith("_metadata.txt"):
                # Convert non-txt files to txt
                document_content = self.convert_to_text(file_path)
                txt_file_path = os.path.join(path, f"{os.path.splitext(file)[0]}.txt")
                with open(txt_file_path, 'w') as txt_file:
                    txt_file.write(document_content)
                file = os.path.basename(txt_file_path)

            if file.endswith(".txt") and not file.endswith("_metadata.txt"):
                doc_number = file.split('.')[0]
                doc_path = os.path.join(path, file)
                metadata_path = os.path.join(path, f"{doc_number}_metadata.txt")

                with open(doc_path, 'r') as doc_file:
                    document_content = doc_file.read()

                if os.path.exists(metadata_path):
                    with open(metadata_path, 'r') as metadata_file:
                        metadata_content = metadata_file.read()
                else:
                    metadata_content = "No metadata available"

                documents.append(metadata_content + "\n" + document_content)

        return documents

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

    def RAG(self, corpus_path, prompt):
        """Perform the full retrieval process: generate embeddings, retrieve document, and generate response."""
        documents = self.parse_docs(corpus_path)
        self.add_embeddings(documents) # adds these to the current
        data = self.retrieve(prompt)
        response = self.generate_response(prompt, data)
        return response

"""
Example Usage:

documents = [
    "Llamas were first domesticated and used as pack animals 4,000 to 5,000 years ago in the Peruvian highlands",
    "Llamas can grow as much as 6 feet tall though the average llama between 5 feet 6 inches and 5 feet 9 inches tall",
    "Llamas weigh between 280 and 450 pounds and can carry 25 to 30 percent of their body weight",
    "Llamas are vegetarians and have very efficient digestive systems",
    "Llamas live to be about 20 years old, though some only live for 15 years and others live to be 30 years old",
]

vector_db = VectorDB()
prompt = "What animals are llamas related to?"
corpus_path = "../../backend/corpus"
response = vector_db.RAG(corpus_path, prompt)

print(response)
"""
