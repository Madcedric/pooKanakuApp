import { NextResponse } from "next/server"
import { supabaseServer } from "@/src/lib/supabaseServer"

type ShopLeaveReportRow = {
  leave_date: string
  leave_type: string | null
  reason: string | null
  custom_description: string | null
  notes: string | null
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const month = url.searchParams.get("month") // expected YYYY-MM
  if (!month) {
    return NextResponse.json({ error: "month query required (YYYY-MM)" }, { status: 400 })
  }

  const start = `${month}-01`
  const [year, mon] = month.split('-').map(Number)
  const lastDay = new Date(year, mon, 0).getDate()
  const end = `${month}-${String(lastDay).padStart(2, '0')}`

  const supabase = supabaseServer()
  const { data, error } = await supabase
    .from("shop_leaves")
    .select("leave_date,leave_type,reason,custom_description,notes")
    .gte("leave_date", start)
    .lte("leave_date", end)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const breakdown: Record<string, number> = {}
  ;((data || []) as ShopLeaveReportRow[]).forEach((r) => {
    const t = r.leave_type || "Unknown"
    breakdown[t] = (breakdown[t] || 0) + 1
  })

  return NextResponse.json({ month, total: data.length, breakdown, rows: data })
}
