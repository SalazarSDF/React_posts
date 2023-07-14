import { TPostData } from "../features/posts/postsSlice";
interface ClientConfig extends RequestInit {
  headers?: { [key: string]: string };
}

interface ResultObject {
  status: number;
  data: TPostData;
  headers: Headers;
  url: string;
}

export async function clientPosts(
  endpoint: string,
  { body, ...customConfig }: { body?: unknown } = {}
): Promise<ResultObject | undefined> {
  const headers: { "Content-Type": string } = {
    "Content-Type": "application/json",
  };

  const config: ClientConfig = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
    },
    ...customConfig,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  let data: TPostData | undefined;
  try {
    const response = await window.fetch(endpoint, config);
    data = (await response.json()) as TPostData;
    if (response.ok) {
      // Return a result object similar to Axios
      return {
        status: response.status,
        data,
        headers: response.headers,
        url: response.url,
      };
    }
    throw new Error(response.statusText);
  } catch (err) {
    if (err instanceof Error) {
      return Promise.reject(err.message ? err.message : data);
    }
    console.error("Unexpected error, message:", err);
  }
}

clientPosts.get = function (
  endpoint: string,
  customConfig: ClientConfig = {}
): Promise<ResultObject | undefined> {
  return clientPosts(endpoint, { ...customConfig });
};

clientPosts.post = function (
  endpoint: string,
  body: unknown,
  customConfig: ClientConfig = {}
): Promise<ResultObject | undefined> {
  return clientPosts(endpoint, { ...customConfig, body });
};
