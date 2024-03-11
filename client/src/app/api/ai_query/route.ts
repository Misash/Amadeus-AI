import { NextResponse, NextRequest } from "next/server";

// send namespace and query to AI api
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
   
    // get query and namwespace from request
    const { query, namespace } = await req.json(); 
    const jsonBody = {
      query: query,
      namespace: namespace,
    };

    const backendUrl = `${process.env.AI_API}/chat`;

    // Send data to backend
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonBody), 
    });


    if (!response.ok) {
      throw new Error(`Failed to send data to backend. Status: ${response.status}`);
    }

    // handle response
    const responseData = await response.json();
    return NextResponse.json(responseData);

  } catch (error) {
    console.error("Error:", error);
    return new NextResponse(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
  }
}
