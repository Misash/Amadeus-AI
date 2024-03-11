"use client";
import { signOut } from "next-auth/react";
import { useState } from "react";

function DashboardPage() {
  // pdf file variables
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(true);
  const [error, setError] = useState("");
  const [namespace, setNamespace] = useState("naruto");

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
      setChat([...chat, { question, answer: data.response }]);
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
            <h1 className="text-5xl mb-4">Chat with your PDF</h1>
            <p className="text-slate-400 mb-4">
              Upload a PDF file to start chatting with its content.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="file"
                onChange={handleFileChange}
                accept="application/pdf"
                className="file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              />
              <button
                type="submit"
                disabled={isUploading}
                className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
              >
                {isUploading ? "Uploading..." : "Upload and Chat"}
              </button>
              {error && <div className="text-red-500">{error}</div>}
            </form>
          </>
        ) : (
          
          //Chat with PDF
          <div className="flex flex-col items-center justify-center space-y-4">
            <form onSubmit={handleChat} className="flex space-x-2">
              {/* query input */}
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask something..."
                className="input input-bordered input-primary w-full max-w-xs"
                required
              />
              {/* submit query button */}
              <button
                type="submit"
                disabled={isLoading || !question}
                className="btn btn-primary"
              >
                {isLoading ? "Asking..." : "Ask"}
              </button>
            </form>

          {/* chat history */}
            <div className="space-y-2 w-full max-w-lg">
              {chat.map((entry, index) => (
                <div key={index} className="chat-message">
                  <div className="font-bold">You asked:</div>
                  <p className="pl-4">{entry.question}</p>
                  <div className="font-bold">AI replied:</div>
                  <p className="pl-4">{entry.answer}</p>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </section>
  );
}

export default DashboardPage;
