from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv, find_dotenv
from langchain_openai import ChatOpenAI, OpenAI
from langchain.prompts.chat import ChatPromptTemplate
from langchain.chains import LLMChain
import os
from pydantic import BaseModel
from pinecone import Pinecone
from langchain_openai import OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore

# Load environment variables
load_dotenv(find_dotenv())

# FastAPI app initialization
app = FastAPI()

# Initialize your components here
llm = OpenAI()
chat_model = ChatOpenAI(model="gpt-3.5-turbo-0125")
chat_template = (
    """ You are an AI trained to extract and understand information from PDFs.
    Your role is to accurately summarize, answer questions,
    and provide insights based on the PDF content presented by the user.
"""
)
human_template =  """
       Question: {user_question} Answer by referencing the PDF's content,
      ensuring clarity and directness in your response."""

chat_prompt = ChatPromptTemplate.from_messages([
    ("system", chat_template),
    ("human", human_template),
])
chain = LLMChain(llm=llm, prompt=chat_prompt)

# Pinecone setup
pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
indexName = "starter-index"
index = pc.Index(indexName)

model_name = 'text-embedding-ada-002'
embeddings = OpenAIEmbeddings(
    model=model_name,
    openai_api_key=os.environ.get("OPENAI_API_KEY")
)

text_field = "text"
vectorstore = PineconeVectorStore(index, embeddings, text_field)


class QuestionRequest(BaseModel):
    query: str
    namespace: str

# endpoints 

@app.get("/")
async def root():
    return {"message": "Hi, I'm Amadeus AI"}


@app.post("/chat")
async def chat(request: QuestionRequest):
    
    search_result = vectorstore.similarity_search(
        request.query,
        namespace=request.namespace,
        k=1
    )
    
    relevant_content = search_result[0].page_content
    
    response_prompt = f"""
        {chat_template}
        user question: {request.query}
        Based on the following information: {relevant_content}
    """
    
    response = chain.invoke({"user_question": response_prompt})
    return {"response": response['text']}
