export const WP_GRAPHQL_ENDPOINT = 'https://dev-sweetleaves.pantheonsite.io/graphql';

export async function getWPData(query: string, variables: Record<string, any> = {}) {
  const res = await fetch(WP_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    cache: 'no-cache',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`WP GraphQL error ${res.status}: ${text}`);
  }
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}
