# Load environment variables
from dotenv import load_dotenv,find_dotenv
load_dotenv(find_dotenv())

from langchain_openai import ChatOpenAI
from langchain_openai import OpenAI

#defining LLm model
llm = OpenAI()
chat_model = ChatOpenAI(model="gpt-3.5-turbo-0125")

 
from langchain.prompts.chat import ChatPromptTemplate


# template for Chat Bot
crm_template = (
    """ You are an AI trained to extract and understand information from PDFs.
    Your role is to accurately summarize, answer questions,
    and provide insights based on the PDF content presented by the user.
"""
)

human_template = (
    """ Question: {user_question} Answer by referencing the PDF's content,
      ensuring clarity and directness in your response."""
)

chat_prompt = ChatPromptTemplate.from_messages([
    ("system", crm_template),
    ("human", human_template),
])

# llm chain
from langchain.chains import LLMChain
chain = LLMChain(llm=llm, prompt=chat_prompt)

# response 
# response = chain.invoke({
#     "customer_inquiry": "Can you tell me more about the features of your latest product?"
# })

# print(response['text'])


# get data from pdf
import  os
from pinecone import Pinecone, ServerlessSpec
from pinecone import Pinecone, PodSpec


pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
indexName = "starter-index"

index = pc.Index(indexName)
print("Index stats: ", index.describe_index_stats())


### initialize langchain with vector store
from langchain_openai import OpenAIEmbeddings

# get openai api key from platform.openai.com
model_name = 'text-embedding-ada-002'
embeddings = OpenAIEmbeddings(
    model=model_name,
    openai_api_key=os.environ.get("OPENAI_API_KEY")
)


from langchain_pinecone import PineconeVectorStore
text_field = "text"
vectorstore = PineconeVectorStore(
    index, embeddings, text_field
)



# query = "tell me about naruto"
# result = vectorstore.similarity_search(
#     query,  # our search query
#     namespace="naruto",
#     k=3  # return 3 most relevant docs
# )
# print(result [0].page_content)



def answer_question(query):

    #find relevant content on vector emdeddings
    search_result = vectorstore.similarity_search(
        query,  # our search query
        namespace="naruto",
        k=1  # return 3 most relevant docs
    )

    # result
    relevant_content = search_result[0].page_content
    
    # chat bot template
    response_prompt = f"""
        {crm_template}
        user question: {question}
        Based on the following information: {relevant_content}
    """
    
    response = chain.invoke({"user_question": response_prompt})
    
    return response['text']


# Example usage
question = "Who is Naruto"
response = answer_question(question)
print(response)




