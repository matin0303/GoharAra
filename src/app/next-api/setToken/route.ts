
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { token , role} = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const response = NextResponse.json({ success: true });
    const isProd = process.env.NODE_ENV === "production";

    response.cookies.set("tk", token, {
      httpOnly: false,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    response.cookies.set("rl", role, {
      httpOnly: false,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });



    return response;
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
