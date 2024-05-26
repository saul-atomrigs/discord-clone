import initialProfile from '@/lib/initial-profile';
import { redirect } from 'next/navigation';
import React from 'react';

/**
 * This page is shown when the user has not yet created a server.
 *
 * It checks if the user is already a member of a server, and if so, redirects
 * them to the server's page. If not, it displays a message asking them to
 * create a server.
 */
export default async function SetupPage() {
  const profile = await initialProfile();

  /**
   * This function finds a server that the user is a member of.
   */
  const server = await prisma.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.profile.id,
        },
      },
    },
  });

  if (server) {
    /**
     * If the user is already a member of a server, redirect them to the server's page.
     */
    return redirect(`/servers/${server.id}`);
  }

  /**
   * If the user is not a member of any server, display a message asking them to create one.
   */
  return <div>Create a Server</div>;
}
