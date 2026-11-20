type SearchableEcho = {
  title?: string | null;
  caption?: string | null;
  story?: string | null;
  category?: string | null;
  author?: { full_name?: string | null } | null;
};

export function matchesEcho(post: SearchableEcho, query: string, category = "All") {
  if (category !== "All" && post.category?.toLowerCase() !== category.toLowerCase()) return false;
  const needle = query.trim().toLowerCase();
  return !needle || [post.author?.full_name, post.title, post.caption, post.story]
    .some((text) => text?.toLowerCase().includes(needle));
}

// Treat user input as literal text, not SQL wildcards or PostgREST filter syntax.
export function echoSearchPattern(query: string) {
  return `%${query.trim().replace(/[\\%_]/g, "\\$&")}%`;
}

export function echoSearchFilter(query: string, authorIds: string[]) {
  const pattern = JSON.stringify(echoSearchPattern(query));
  const clauses = ["title", "caption", "story"].map((field) => `${field}.ilike.${pattern}`);
  const validIds = authorIds.filter((id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));
  if (validIds.length) clauses.push(`author_id.in.(${validIds.join(",")})`);
  return clauses.join(",");
}