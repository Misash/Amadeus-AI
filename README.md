# Amadeus AI - Chatbot

> Chatbot app for ask question about documents

# Technical Overview

## AI Agent and Vector Database

I used LangChain with the GPT-3.5-turbo-0125 model API for the chatbot and the text-embedding-ada-002 model API for embeddings, storing them in Pinecone as a vector database.

![image](https://github.com/Misash/Amadeus-AI/assets/70419764/dbe2b140-8867-43b1-a210-b57e1c1f36a4)
<p align="center"><strong>Vector Databse Architecture</strong></p>

### langChain

Serves as a powerful framework for handling embeddings, efficient document indexing and retrieval.

![image](https://github.com/SourasishBasu/ChatPDF-clone-llama2b/assets/89185962/e6588ecf-f1ec-49ab-b354-11f23a76ea08)
<p align="center"><strong>Retriever Engine</strong></p>

## Frontend and Backend

I used Next.js, Prisma, and NextAuth for the frontend. For the backend, I divided it into two microservices: the chatbot (AI_API) and the PDF embeddings store (PDF_API). Both are containerized in Docker, and I used their images from Docker Hub to run instances on Google Cloud Run.

![image](https://github.com/Misash/Amadeus-AI/assets/70419764/f63e7886-7951-4f07-b935-cd2cad1bf3f9)
<p align="center"><strong>App Architecture</strong></p>

# Prerequisites

- Next.js 14 (App Router) in TypeScript
- FastAPI in Python 3.10
- AI-related
  - Pinecone (Vector Database)
  - Langchain
  - OpenAI API
- Auth
  - NextAuth
- ORM
  - Prisma
- Database
  - Drizzle ORM
  - ElephantSQL (Serverless PostgreSQL)
- Cloud
  - Docker
  - DockerHub
  - Google CLoud Run
  - Vercel
- CI/CD
  - github actions

# Setup

To set up Amadeus AI , follow these steps:

## Backend

1. **Clone the Repository**: Clone the ChatPDF Clone repository to your local machine.

```bash
   git clone https://github.com/Misash/Amadeus-AI.git
   cd AI/
   cd Vectorization/
```

2. **Build Docker container**

```bash
   docker build -t app .
```

3. **execute app in the container**

```bash
   docker run -d --name app -p 8000:8000 app
```

4. **login to Docker Hub**

```bash
    docker login
```

5. **Push image to docker Hub**

```bash
    docker tag newapp username/app:version
    docker push username/newapp:version
```

## Frontend

1. **Clone the Repository**: Clone the ChatPDF Clone repository to your local machine.

   ```bash
   git clone https://github.com/Misash/Amadeus-AI.git
   ```

2. **Install Dependencies**: Navigate to the project directory and install the necessary dependencies.

   ```bash
   cd client
   npm install
   ```

3. **Configure Credentials**: Add the environment variables

```bash
    DATABASE_URL="*********"
    NEXTAUTH_URL="*********"
    PDF_API="*********"
    AI_API="*********"
```

4. **ync wtih prisma schema**

```bash
    npx prisma db push
```

## Deploy with Vercel

[Deploy with Vercel](https://nextjs.org/docs/deployment)


# Usage
Once you enter, you will need to register or log in, then you will be directed to the dashboard where you can upload the PDF and ask the chatbot.

[Try Amadeus AI and Chat with your PDF](https://amadeus-ai.vercel.app/)


### Screenshots

![image](https://github.com/Misash/Amadeus-AI/assets/70419764/26a06038-b30a-49b5-833b-6afef86c0ccf)


![image](https://github.com/Misash/Amadeus-AI/assets/70419764/fd283882-9975-4719-8e93-4568959fd37c)


![image](https://github.com/Misash/Amadeus-AI/assets/70419764/c1a0ffe5-9f69-44d4-9af1-e605e642620d)

## Challenges

- **Retrieval Performance**: Retrieval accuracy and speed were severely affected by an increase in document quantity because I stored every PDF's embeddings with a unique namespace on Pinecone, due to free plan limitations.

- **Handling Dynamic Conversations**: Adapting the chatbot to handle dynamic and evolving conversations while maintaining coherence presented a challenge because I don't store the history; I just store it in the client's memory.