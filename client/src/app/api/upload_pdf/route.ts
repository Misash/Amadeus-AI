import { NextResponse, NextRequest } from "next/server";

export function GET(req: NextRequest) {
  return NextResponse.json("upload pdf");
}

// function to send PDF to PDF_API with file and index_name parameters
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // req is a 'multipart/form-data' 
    const formData = await req.formData();
    console.log("FormData: ", formData);
    const file = formData.get("file"); 
    const indexName = formData.get("index_name"); 

    const backendUrl =  `${process.env.PDF_API}/upload_pdf/`
    const backendFormData = new FormData();
    backendFormData.append("pdf", file);

    // append vectore store index name
    if (indexName) {
      backendFormData.append("index_name", indexName.toString());
    }

    // send pdf to backend
    const response = await fetch(backendUrl, {
      method: "POST",
      body: backendFormData, 
    });

    const responseData = await response.json();

    // response to frontend
    return NextResponse.json(responseData);

  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
