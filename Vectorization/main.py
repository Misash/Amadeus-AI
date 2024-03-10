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
import os
from pinecone import Pinecone, ServerlessSpec
from pinecone import Pinecone, PodSpec
import base64
import time


def createIndexPinecone(indexName,pc):
    pc.create_index(
        name=indexName,
        dimension=1536,
        metric="cosine",
        spec=PodSpec(
            environment="gcp-starter"
        )
    )
    


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


def InitPinecone(indexName,pc,pdfpath):

     # check if the extractive-question-answering index exists
    indexFound = indexName in pc.list_indexes().names()

     # create an index
    if indexFound != True :
        createIndexPinecone()
    
    #process Pdf
    storeEmbeddingsPinecone(pdfpath,indexName)
    




## MAIN

# connect with pinecone 
pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))

pdf_path = "./pdf/paper2.pdf"
index_name = "starter-index"


InitPinecone(index_name,pc,pdf_path)






