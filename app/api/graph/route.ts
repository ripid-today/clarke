import { NextResponse } from 'next/server';
import { getDriver } from '@/lib/neo4j';

export async function GET() {
  const driver = getDriver();
  const session = driver.session();

  try {
    const conceptsResult = await session.run(`
      MATCH (c:Concept)
      RETURN c.id AS id, c.name AS name, c.description AS description,
             c.content AS content, c.word_count AS word_count
    `);

    const topicsResult = await session.run(`
      MATCH (t:Topic)
      RETURN t.id AS id, t.name AS name, t.description AS description,
             t.content AS content, t.level AS level, t.concept_count AS concept_count
    `);

    const edgesResult = await session.run(`
      MATCH (a)-[r:SPECIALIZES|PART_OF|ENABLES|CONTRADICTS|ANALOG_TO|INDEXED_UNDER]->(b)
      RETURN a.id AS source, b.id AS target, type(r) AS rel_type
    `);

    const concepts = conceptsResult.records.map((r) => ({
      id: r.get('id'),
      name: r.get('name'),
      description: r.get('description') || '',
      content: r.get('content') || '',
      word_count: r.get('word_count')?.toNumber?.() || r.get('word_count') || 0,
    }));

    const topics = topicsResult.records.map((r) => ({
      id: r.get('id'),
      name: r.get('name'),
      description: r.get('description') || '',
      content: r.get('content') || '',
      level: r.get('level')?.toNumber?.() || r.get('level') || 1,
      concept_count: r.get('concept_count')?.toNumber?.() || r.get('concept_count') || 0,
    }));

    const edges = edgesResult.records.map((r) => ({
      source: r.get('source'),
      target: r.get('target'),
      rel_type: r.get('rel_type'),
    }));

    return NextResponse.json(
      { concepts, topics, edges },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (err) {
    console.error('Graph API error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch graph data' },
      { status: 500 }
    );
  } finally {
    await session.close();
  }
}
