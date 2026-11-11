import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  const rows = await query(
    "SELECT section, key_name, value_long, value_short, sort_order FROM ibn_group_contents WHERE is_published = 1 ORDER BY section, sort_order"
  );

  const content: Record<string, Record<string, { short?: string; long?: string }>> = {};
  for (const row of rows) {
    if (!content[row.section]) content[row.section] = {};
    content[row.section][row.key_name] = {
      short: row.value_short,
      long: row.value_long,
    };
  }

  return NextResponse.json({ content });
}
