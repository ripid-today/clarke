export const metadata = {
  title: 'Athena - Knowledge Graph Viewer',
  description: 'Interactive knowledge graph powered by Neo4j',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
