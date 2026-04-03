export function cell(
  row: Record<string, string>,
  ...preferredKeys: string[]
): string {
  for (const key of preferredKeys) {
    if (key in row && row[key] != null && String(row[key]).trim() !== "") {
      return String(row[key]).trim();
    }
  }
  const lowerMap = new Map(
    Object.entries(row).map(([k, v]) => [k.toLowerCase().trim(), v]),
  );
  for (const key of preferredKeys) {
    const v = lowerMap.get(key.toLowerCase().trim());
    if (v != null && String(v).trim() !== "") {
      return String(v).trim();
    }
  }
  return "";
}
