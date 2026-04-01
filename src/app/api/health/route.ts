import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const checks: Record<string, string> = {
    status: 'ok',
    database: 'unknown',
    hasDbUrl: process.env.DATABASE_URL ? 'yes' : 'no',
    hasJwtSecret: process.env.JWT_SECRET ? 'yes' : 'no',
  };

  try {
    const count = await prisma.adminUser.count();
    checks.database = 'connected';
    checks.adminUsers = String(count);
  } catch (error) {
    checks.database = 'error';
    checks.dbError = error instanceof Error ? error.message : 'Unknown';
  }

  return NextResponse.json(checks);
}
