"use client"
import { signOut } from 'next-auth/react';
import { useState } from 'react';

function DashboardPage() {
  // pdf file variables
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };


  // function to send pdf
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (file) {
      setIsUploading(true);
      setError('');
      const formData = new FormData();
      formData.append('file', file);

      try {
        //fetch to api
        const response = await fetch( "/api/upload_pdf", {
          method: 'POST',
          body: formData,
        });

        console.log("res: ",response)

        if (!response.ok) {
          throw new Error('Failed to upload PDF');
        }
        const data = await response.json();
        console.log("data",data); 
        setIsFileUploaded(true);
      } catch (err) {
        console.error("err:",err);
        setError('Failed to upload PDF. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <section className="h-[calc(100vh-7rem)] flex flex-col items-center justify-center bg-neutral-950 text-white">
      <div className="text-center">

        {!isFileUploaded ? (

          // upload PDF
          <>
            <h1 className="text-5xl mb-4">Chat with your PDF</h1>
            <p className="text-slate-400 mb-4">Upload a PDF file to start chatting with its content.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="file"
                onChange={handleFileChange}
                accept="application/pdf"
                className="file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              />
              <button type="submit" disabled={isUploading} className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded">
                {isUploading ? 'Uploading...' : 'Upload and Chat'}
              </button>
              {error && <div className="text-red-500">{error}</div>}
            </form>
          </>
        ) : (

          //Chat with PDF
          <>
            <h1 className="text-5xl mb-4">Chat with your PDF</h1>
            <div>Chat component goes here</div>
          </>
        )}
      </div>
    </section>
  );
}

export default DashboardPage;
