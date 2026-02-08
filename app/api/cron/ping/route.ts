import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export async function GET(request: Request) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findFirst({
      select: { id: true },
    });

    console.log('Database pinged successfully at:', new Date().toISOString());

    return NextResponse.json({
      success: true,
      message: 'Database pinged successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Database ping failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Ping failed',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
