import { Redirect } from "expo-router";
import { useAuthStore } from "../src/store/auth";

export default function Index() {
  const token = useAuthStore((s) => s.token);
  return <Redirect href={token ? "/events" : "/login"} />;
}
