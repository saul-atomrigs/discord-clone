import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from './db';

type Profile = {
  id: string;
  name: string;
  imageUrl: string;
  email: string;
};

/**
 * Creates an initial profile for a user if one doesn't already exist.
 * @returns Promise that resolves to the user's profile, or redirects the user to sign in if they are not authenticated.
 */
export default async function initialProfile(): Promise<{
  profile: Profile;
}> {
  const user = await currentUser();

  if (!user) {
    // If the user is not authenticated, redirect them to sign in.
    return auth().redirectToSignIn();
  }

  const profile = await prisma.profile.findUnique({
    // Find the user's profile by its userId.
    where: {
      userId: user.id,
    },
  });

  if (profile) {
    // If a profile exists for the user, return it.
    return {
      profile,
    };
  }

  const newProfile = await prisma.profile.create({
    // Create a new profile for the user.
    data: {
      // Set the user's name, image URL, and email address.
      userId: user.id,
      name: `${user.firstName}` + ' ' + `${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  // Return the new profile.
  return newProfile;
}
