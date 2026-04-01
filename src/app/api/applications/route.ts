import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, company, phone, email, productInterest, message, source, utmParams } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      );
    }

    const application = await prisma.application.create({
      data: {
        name,
        company: company || null,
        phone,
        email: email || null,
        productInterest: productInterest || [],
        message: message || null,
        source: source || null,
        utmParams: utmParams || null,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    );
  }
}
