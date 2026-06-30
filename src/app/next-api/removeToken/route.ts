
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const response = NextResponse.json({ success: true });
    const isProd = process.env.NODE_ENV === "production";
    response.cookies.set("tk", '', {
      httpOnly: false,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 0,
    });
    response.cookies.set("rl", '', {
      httpOnly: false,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 0,
    });


    return response;
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
