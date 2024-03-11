
# CRM ChatBot

Custom knowledge chatbot for CRM data using langchain, openAI llm and Pinecone 

## requirements
pip >= 22.0.2 & python >= 3.10.12

create and .env with api keys

```py
  OPENAI_API_KEY = "sk-***************"
  PINECONE_API_KEY = "****************"
```

## Install Dependencies
```bash
  chmod +x init.sh
  ./init.sh
```

## Run locally 
```bash
    source .venv/bin/activate
    uvicorn main:app --reload
```

