interface ClientConfig extends RequestInit {
  headers?: { [key: string]: string };
}

export type TComments = {
  id: number;
  body: string;
  postId: number;
  user: {
    id: number;
    username: string;
  };
};

export type TDataPostComments = {
  comments: TComments[];
  total: number;
  skip: number;
  limit: number;
};

interface ResultObject {
  status: number;
  data: TDataPostComments;
  headers: Headers;
  url: string;
}

export async function clientPostComments(
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

  let data: TDataPostComments | undefined;
  try {
    const response = await window.fetch(endpoint, config);
    data = (await response.json()) as TDataPostComments;
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

clientPostComments.get = function (
  endpoint: string,
  customConfig: ClientConfig = {}
): Promise<ResultObject | undefined> {
  return clientPostComments(endpoint, { ...customConfig });
};

clientPostComments.post = function (
  endpoint: string,
  body: unknown,
  customConfig: ClientConfig = {}
): Promise<ResultObject | undefined> {
  return clientPostComments(endpoint, { ...customConfig, body });
};
