import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json(
      { error: "Email is required" },
      { status: 400 }
    );
  }

  const senderApiToken = process.env.SENDER_API_TOKEN;
  if (!senderApiToken) {
    return NextResponse.json(
      { error: "Newsletter service not configured" },
      { status: 500 }
    );
  }

  const response = await fetch("https://api.sender.net/v2/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${senderApiToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      groups: ["ej5R9B"],
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: response.status }
    );
  }

  return NextResponse.json({ success: true });
}
