export function isSafeSelectQuery(query: string): boolean {
  const q = query.trim().toLowerCase();

  if (!q.startsWith("select")) return false;

  if (q.includes(";")) return false;

  if (q.includes("--") || q.includes("/*")) return false;

  const forbidden = [
    "insert",
    "update",
    "delete",
    "drop",
    "truncate",
    "alter",
    "create"
  ];

  return !forbidden.some(word => q.includes(word));
}