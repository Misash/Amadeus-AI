# Load environment variables
from dotenv import load_dotenv,find_dotenv
load_dotenv(find_dotenv())

# Embeddings and Vector Stores
from langchain_community.document_loaders import TextLoader
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter


# get data from pdf
import re, os
import pinecone
from pinecone import Pinecone, ServerlessSpec
from pinecone import Pinecone, PodSpec

# connect with pinecone 
pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))


def createIndexPinecone(indexName):
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


def deleteIndexPinecone(indexName):
    pc.delete_index(indexName)





# Create index on Pinecone
indexName = "starter-index"
# createIndexPinecone(indexName)


# Create an unique namespace for pdf
# index = pc.Index(indexName)
# Upsert records while creating a new namespace
# index.upsert(vectors=[('id-1', [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1])],namespace='my-first-namespace')



# get text from pdf
# from langchain_community.document_loaders import PyPDFLoader
# loader = PyPDFLoader("./pdf/naruto.pdf")
# loader = TextLoader("./data/enterprise_data.txt")
# documents = loader.load()

# split pdf on chunks
# text_splitter = CharacterTextSplitter(
#     separator="\n",
#     chunk_size=1000,
#     chunk_overlap=0,
# )
# docs = text_splitter.split_documents(documents)

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
query = "tell me about naruto"
# result  = docsearch.similarity_search(query)
result  = docsearch.similarity_search(
    namespace="naruto",
    query = query
)
print(result [0].page_content)


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





