"use client";
import { signOut } from "next-auth/react";
import { useState } from "react";

function DashboardPage() {
  // pdf file variables
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [error, setError] = useState("");
  const [namespace, setNamespace] = useState("");

  // chat variables
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // function to send pdf to api
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (file) {
      setIsUploading(true);
      setError("");
      const formData = new FormData();
      formData.append("file", file);

      try {
        //fetch to api
        const response = await fetch("/api/upload_pdf", {
          method: "POST",
          body: formData,
        });

        // console.log("res: ",response)

        if (!response.ok) {
          throw new Error("Failed to upload PDF");
        }

        const data = await response.json();
        // console.log("reponse data: ",data.namespace);

        setNamespace(data.namespace);
        setIsFileUploaded(true);
      } catch (err) {
        console.error("err:", err);
        setError("Failed to upload PDF. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  // function to send Question to api
  const handleChat = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai_query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: question, namespace: namespace }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch AI response");
      }

      // update chat history
      const data = await response.json();

      //save user chat history
      setChat([...chat, { author: "user", question: question }]);
      
      //save AI chat history
      setChat((currentChat) => [
        ...currentChat,
        { author: "ai", answer: data.response },
      ]);

      setQuestion("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="h-[calc(100vh-7rem)] flex flex-col items-center justify-center bg-neutral-950 text-white">
      <div className="text-center">
        {!isFileUploaded ? (
          // upload PDF
          <>
            <h1 className="text-6xl mb-8">Chat with your PDF</h1>
            <p className="text-slate-400 mb-16">
              Upload a PDF file to start chatting with its content.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="file"
                onChange={handleFileChange}
                accept="application/pdf"
                className="file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              />

              <br/>
              {/* upload and Chat button */}
              <button
                type="submit"
                disabled={isUploading}
                className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-8  rounded"
              >
                {isUploading ? "Uploading..." : "Upload and Chat"}
              </button>

              {error && <div className="text-red-500">{error}</div>}
            </form>
          </>
        ) : (
          <section className="ml-40 mr-40 mt-5 h-[calc(100vh-7rem)] flex flex-col justify-between bg-neutral-950 text-white">
            <div className="px-4 py-2 overflow-y-auto">
              {/* Chat history */}
              {chat.map((entry, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    entry.author === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[60%] text-left p-3 rounded-2xl ${
                      entry.author === "user" ? "bg-blue-500" : "bg-gray-700"
                    }`}
                  >
                    <p>{entry.question}</p>
                    <p className="text-gray-300">{entry.answer}</p>
                  </div>
                 
                </div>
              ))}
            </div>

            {/* Input area */}
            <div className="bg-neutral-800 p-4 rounded-lg">
              {!isFileUploaded ? (
                <>
                  <h1 className="text-xl mb-2">Chat with your PDF</h1>
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col space-y-2"
                  >
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="application/pdf"
                      className="file:rounded-lg file:border-0 file:bg-neutral-700 file:text-white"
                    />
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="bg-blue-500 hover:bg-blue-600 font-bold py-2 rounded-lg"
                    >
                      {isUploading ? "Uploading..." : "Upload PDF"}
                    </button>
                    {error && <div className="text-red-500">{error}</div>}
                  </form>
                </>
              ) : (
                <form onSubmit={handleChat} className="flex space-x-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask something..."
                    className="flex-1 p-2 input input-bordered input-neutral bg-neutral-700 text-white rounded-lg"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !question}
                    className="btn p-2 bg-green-400 hover:bg-green-100 text-black rounded-lg"
                  >
                    {isLoading ? "Sending..." : "Send"}
                  </button>
                </form>
              )}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}

export default DashboardPage;
