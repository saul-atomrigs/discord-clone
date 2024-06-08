import { currentProfile } from '@/lib/current-profile';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse('Unauthorized', { status: 400 });
    }

    const server = await prisma.server.update({
      where: {
        id: params.serverId,
        // the person who is leaving is NOT the server owner:
        profileId: {
          not: profile.id,
        },
        // the person who is leaving is actually a member of the server
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      // delete the member using the profile ID
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[SERVER_PATCH]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
