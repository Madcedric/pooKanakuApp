import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ ok: true, msg: 'shop_leaves ping' })
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}
