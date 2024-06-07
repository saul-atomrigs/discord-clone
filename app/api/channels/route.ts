import { currentProfile } from '@/lib/current-profile';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { MemberRole } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get('serverId');

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!serverId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (name === 'general') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const server = await prisma.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: { name, type, profileId: profile.id },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[CHANNEL_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
