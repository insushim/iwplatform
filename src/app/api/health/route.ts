
export function GET() {
  return Response.json({
    status: "ok",
    service: "edumakers",
    timestamp: new Date().toISOString(),
  });
}
