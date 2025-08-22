import Constants from "expo-constants";
import { useAuthStore } from "../store/auth";

const EXTRA = (Constants?.expoConfig?.extra ?? {}) as any;

export const API_URL =
  EXTRA?.apiUrl || "http://192.168.x.x:4001/graphql";

async function graphQL<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  const token = useAuthStore.getState().token;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors.map((e: any) => e.message).join(", "));
  }
  return json.data;
}

export const gql = graphQL;
