# Induct-AI

Induct-AI is a completely offline and bare-bones onboarding system designed to streamline the process of integrating new employees into a company. It provides a platform to allow managers and admins at the company to add documents, generating responses to user queries, and facilitating communication between users and managers.

## Inspiration

**Did you know that the average onboarding process for new hires ranges from 3-6 months?**
As interns and co-op students, and based on multiple academic papers backing it, we see onboarding processes as a highly inefficient market with opportunity. For new hires, the first few months are usually the most unproductive due to slow onboarding, alongside many other factors related to being new and afraid to ask every question that comes to mind (which would otherwise feel more expensive than asking a chatbot). Within the tech field, the onboarding processes are somewhat streamlined; however, when we extend to other fast-paced industries like finance and healthcare, we quickly realize that their onboarding processes continue to deteriorate. That's why we propose our completely offline automated workflow that allows the interns to ask questions as if they were talking to their manager/team leads without feeling inefficient on company time.

## Features

- **Document Management**: Upload, delete, and update documents with associated metadata.
- **AI-Powered Responses**: Use AI to generate responses to user queries based on the document corpus.
- **User Roles**: Differentiate between user and manager roles for tailored access and functionality.
- **Interactive Frontend**: A user-friendly interface for managing documents and interacting with the AI system.

## Prerequisites

- Python 3.8 or higher
- Node.js and npm
- FastAPI
- Uvicorn
- React

## Setup Instructions

### Backend Setup

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Python Dependencies**

   Ensure you have a virtual environment set up, then install the required Python packages:

   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Backend Server**

   Use Uvicorn to start the FastAPI backend server:

   ```bash
   uvicorn --reload backend.api:app
   ```

   The backend server will be running at `http://127.0.0.1:8000`.

### Frontend Setup

1. **Navigate to the Frontend Directory**

   ```bash
   cd frontend/app
   ```

2. **Install Node.js Dependencies**

   ```bash
   npm install
   ```

3. **Run the Frontend Server**

   Start the React development server:

   ```bash
   npm run dev
   ```

   The frontend will be accessible at `http://localhost:3000`.

## Project Structure

- **Backend**: Built with FastAPI, the backend handles API requests for document management and AI interactions.

  - `backend/routers`: Contains API routes for user and manager functionalities.
  - `backend/models`: Defines data models for requests and responses.
  - `backend/utils.py`: Utility functions for database and AI model interactions.
  - `model/model/db.py`: Manages document parsing, embedding, and retrieval using a vector database.
  - `model/model/llm.py`: Handles AI model interactions for generating responses.
- **Frontend**: Built with React, the frontend provides an interface for users to interact with the system.

  - `frontend/app`: Main application directory containing components and pages.
  - `frontend/app/components`: Reusable UI components.
  - `frontend/app/manager/page.tsx`: Manager page for document management.

## Usage

- **Document Management**: Managers can upload, delete, and update documents. Each document can have associated metadata.
- **AI Interaction**: Users can ask questions, and the system will generate responses based on the document corpus.
- **Role-Based Access**: Users and managers have different access levels, ensuring secure and appropriate interactions.

## Extending the Project

- **Add More AI Models**: Integrate additional AI models for more advanced response generation.
- **Enhance User Interface**: Improve the frontend with more features and better design.
- **Expand Document Types**: Support more document formats for upload and processing.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License.
