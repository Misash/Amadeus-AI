# Load environment variables
from dotenv import load_dotenv,find_dotenv
load_dotenv(find_dotenv())

# Embeddings and Vector Stores
from langchain_community.document_loaders import TextLoader
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter
from langchain_pinecone import PineconeVectorStore

# get data from pdf
from langchain_community.document_loaders import PyPDFLoader
import re, os
import pinecone
from pinecone import Pinecone, ServerlessSpec
from pinecone import Pinecone, PodSpec
import base64
import time


def createIndexPinecone(indexName,pc):
    # pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
    indexFound = indexName in pc.list_indexes().names()

    # check if the extractive-question-answering index exists
    if indexFound != True :
        pc.create_index(
            name=indexName,
            dimension=1536,
            metric="cosine",
            spec=PodSpec(
                environment="gcp-starter"
            )
        )
    
    print(indexFound)
    return indexFound


def deleteIndexPinecone(indexName,pc):
    pc.delete_index(indexName)



def storeEmbeddingsPinecone(pdfpath,index_name):

    # get text from pdf
    loader = PyPDFLoader(pdfpath)
    documents = loader.load()
    print("reading Pdf...")

    # split pdf on chunks
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=0,
    )
    docs = text_splitter.split_documents(documents)
    print("num of chunks: ",len(docs))

    #turn the chunks on embeddings
    embeddings = OpenAIEmbeddings()
    # query_result = embeddings.embed_query(docs[0].page_content)
    # print(query_result)

    # code pdf name to store as namespace on vectordb
    pdfNameFile = os.path.basename(pdfpath) 
    pdfNameFile = os.path.splitext(pdfNameFile)[0] 
    timestamp = str(time.time())
    uniqueName = pdfNameFile + "_" + timestamp
    encodedName = base64.urlsafe_b64encode(uniqueName.encode()).decode()

    # decodedBytes = base64.urlsafe_b64decode(encodedName)
    # decodedName = decodedBytes.decode()

    #store embeddings on namespace Pinecone Vectore Store
    docsearch = PineconeVectorStore.from_documents(docs, embeddings, index_name=index_name, namespace=encodedName)


# connect with pinecone 
pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))

pdf_path = "./pdf/naruto.pdf"
index_name = "starter-index"


storeEmbeddingsPinecone(pdf_path,index_name)







# pdfNameFile = os.path.basename(pdfpath) 
# pdfNameFile = os.path.splitext(pdfNameFile)[0] 
# timestamp = str(time.time())
# print("pdf name: ",pdfNameFile)
# uniqueName = pdfNameFile + "_" + timestamp
# print("uniqueName: ",uniqueName)
# encodedName = base64.urlsafe_b64encode(uniqueName.encode()).decode()
# print("encoded: ", encodedName)
# decodedBytes = base64.urlsafe_b64decode(encodedName)
# decodedName = decodedBytes.decode()
# print("dncoded: ", decodedName)


# print chunks
# for i in range(len(docs)):
#     # print(f"CHUNK {i}:\n\n")
#     print(f"CHUNK {i}:\n\n", docs[i].page_content)
# print("num of chunks: ",len(docs))


#turn the chunks on embeddings
# embeddings = OpenAIEmbeddings()
# query_result = embeddings.embed_query(docs[0].page_content)
# print(query_result)


#store embeddings on Pinecone
# from langchain_pinecone import PineconeVectorStore
# index_name = "starter-index"
# docsearch = PineconeVectorStore.from_documents(docs, embeddings, index_name=index_name, namespace="naruto")


# vector similarity search
# query = "tell me about naruto"
# # result  = docsearch.similarity_search(query)
# result  = docsearch.similarity_search(
#     namespace="naruto",
#     query = query
# )
# print(result [0].page_content)


# def answer_question(question):
#     #find relevant content on vector emdeddings
#     search_result = docsearch.similarity_search(question)
#     relevant_content = search_result[0].page_content
    
#     # concatenate revelant content with crm_template
#     response_prompt = f"""
#     {crm_template}
    
#     user question: {question}
    
#     Based on the following information: {relevant_content}
#     """
    
#     response = chain.invoke({"user_question": response_prompt})
    
#     return response['text']

# # Example usage
# question = "What products do you have?"
# response = answer_question(question)
# print(response)





