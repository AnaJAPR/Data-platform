import { BACKEND_BASE_URL } from "@/lib/env";
import { NextRequest, NextResponse } from "next/server";
import { verifyUser } from "../auth/verify";

export async function GET(req: NextRequest) {
  const result = await verifyUser(req);

  if (!result) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const token = req.cookies.get("access_token")?.value;

  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/user/me/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to fetch user profile" },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json(data, {
      status: 200,
      headers: result.headers,
    });

  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
