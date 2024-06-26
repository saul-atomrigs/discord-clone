import { NextResponse } from 'next/server';
import { uuidv4 } from 'uuid';

import { prisma } from '../../../../../lib/db';
import { currentProfile } from '../../../../../lib/current-profile';

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const server = await prisma?.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[SERVER_PATCH]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
