// Turns draft mode back off (the "Exit preview" banner links here) and sends
// the visitor to the homepage with normal published content.

import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export function GET(request: Request) {
  draftMode().disable();
  return NextResponse.redirect(new URL("/", request.url));
}
