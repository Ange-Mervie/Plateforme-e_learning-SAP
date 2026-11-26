import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  const rows = await query<Record<string, unknown>>(
    "SELECT section, key_name, value_long, value_short, sort_order FROM ibn_group_contents WHERE is_published = 1 ORDER BY section, sort_order"
  );

  const content: Record<string, Record<string, { short?: string; long?: string }>> = {};
  for (const row of rows) {
    const section = String(row.section ?? "");
    const keyName = String(row.key_name ?? "");
    if (!content[section]) content[section] = {};
    content[section][keyName] = {
      short: row.value_short as string | undefined,
      long: row.value_long as string | undefined,
    };
  }

  return NextResponse.json({ content });
}
