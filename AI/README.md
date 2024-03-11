
# AI agent

AI agent to make queries about a text which is stored in a vector store.

## requirements
 - pip  22.0.2 
 - python  3.10.12 
 - Docker 24.0.6 

create and .env with api keys

```py
  OPENAI_API_KEY = "sk-***************"
  PINECONE_API_KEY = "****************"
```

## Install Dependencies
```bash
  python3 -m venv .venv
  source .venv/bin/activate
  pip3 install -r requirements.txt
```


## Run locally 
```bash
    source .venv/bin/activate
    uvicorn main:app --reload
```

## Docker

```bash
    # build Docker image
    docker build -t ai_app .
    # execute app in the container
    docker run -d --name ai_app -p 8000:8000 ai_app
    # login to Docker Hub
    docker login
    #tag local Docker image
    docker tag pdf_app username/ai_api:version
    # push image to docker Hub
    docker push username/ai_api:version
```

## Deploy on Google Run

```bash
    # Measure latency before select the region
    https://gcping.com/
    # Port according to Dockerfile
    port: 8000
```


