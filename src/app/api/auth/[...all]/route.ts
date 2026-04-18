import { getAuth } from "@/lib/auth/server";


async function handler(req: Request) {
  const auth = getAuth();
  return auth.handler(req);
}

export { handler as GET, handler as POST };
