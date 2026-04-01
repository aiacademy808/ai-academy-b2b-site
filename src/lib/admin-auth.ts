import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';

export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: { id: number; username: string; role: string }) => Promise<NextResponse>
) {
  const token = request.cookies.get('admin-token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await verifyToken(token);
  if (!user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  return handler(request, user);
}
