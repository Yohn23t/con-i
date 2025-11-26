import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const result = await sql`SELECT is_enabled FROM maintenance_mode LIMIT 1`;
    const maintenanceMode = result.length > 0 ? result[0].is_enabled : false;
    return Response.json({ isActive: maintenanceMode });
  } catch (error) {
    console.error('Failed to fetch maintenance status:', error);
    return Response.json({ isActive: false });
  }
}

export async function PUT(request: Request) {
  try {
    const { isActive } = await request.json();
    
    const adminCheck = await sql`SELECT COUNT(*) FROM maintenance_mode`;
    
    if (adminCheck[0].count === 0) {
      await sql`INSERT INTO maintenance_mode (is_enabled) VALUES (${isActive})`;
    } else {
      await sql`UPDATE maintenance_mode SET is_enabled = ${isActive}`;
    }
    
    return Response.json({ success: true, isActive });
  } catch (error) {
    console.error('Failed to update maintenance mode:', error);
    return Response.json({ error: 'Failed to update maintenance mode' }, { status: 500 });
  }
}
