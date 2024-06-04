import { currentProfile } from '@/lib/current-profile';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();
    const serverId = searchParams.get('serverId');

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!serverId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!params.memberId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const server = await prisma.server.update({
      // Which 'server' to updated based on serverId and profileId
      where: {
        id: serverId,
        profileId: profile.id,
      },
      // this is the data to update within the 'server'
      data: {
        members: {
          update: {
            // which member to update, based on memberId and
            // profileID should not be the same as the profile
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
              },
            },
            // Update the role of the member
            data: {
              role,
            },
          },
        },
      },
      // Include the members and their profiles, and order them by role
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[MEMBERS_PATCH]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get('serverId');

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!serverId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!params.memberId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const server = await prisma.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[MEMBERS_DELETE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
