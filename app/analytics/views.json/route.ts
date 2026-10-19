// Local preview data. In production, Nginx serves the real, limited JSON feed.
export function GET() {
  if (process.env.NODE_ENV !== "development") {
    return new Response(null, { status: 404 });
  }

  return Response.json({
    generatedAt: new Date().toISOString(),
    demo: true,
    pages: {
      "/": 1234,
      "/writing": 356,
      "/projects": 248,
      "/writing/portfolio-overview": 89,
    },
  });
}
