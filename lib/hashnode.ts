export type BlogPost = {
  id: string;
  title: string;
  brief: string;
  slug: string;
  url: string;
  coverImage: string | null;
  publishedAt: string;
  readTimeInMinutes: number;
};

type HashnodePostNode = {
  id: string;
  title: string;
  brief: string;
  slug: string;
  url: string;
  coverImage: { url: string } | null;
  publishedAt: string;
  readTimeInMinutes: number;
};

type HashnodeResponse = {
  data?: {
    publication?: {
      posts?: {
        edges?: { node: HashnodePostNode }[];
      };
    };
  };
};

const HASHNODE_ENDPOINT = "https://gql.hashnode.com";
const PUBLICATION_HOST = "ankitnegi-dev.hashnode.dev";

const QUERY = `
  query Posts($host: String!) {
    publication(host: $host) {
      posts(first: 10) {
        edges {
          node {
            id
            title
            brief
            slug
            url
            coverImage { url }
            publishedAt
            readTimeInMinutes
          }
        }
      }
    }
  }
`;

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(HASHNODE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: QUERY,
        variables: { host: PUBLICATION_HOST },
      }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const json: HashnodeResponse = await res.json();
    const edges = json.data?.publication?.posts?.edges ?? [];

    return edges.map((edge) => ({
      id: edge.node.id,
      title: edge.node.title,
      brief: edge.node.brief,
      slug: edge.node.slug,
      url: edge.node.url,
      coverImage: edge.node.coverImage?.url ?? null,
      publishedAt: edge.node.publishedAt,
      readTimeInMinutes: edge.node.readTimeInMinutes,
    }));
  } catch {
    return [];
  }
}