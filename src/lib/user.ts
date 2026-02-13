import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from './db';

/**
 * Gets the Prisma user ID corresponding to the current Clerk user.
 * If the user doesn't exist in Prisma, it creates them.
 */
export async function getDbUser() {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return null;
  }

  // Check if user exists in database
  let user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  // If not, create them using Clerk details
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User';

    user = await prisma.user.create({
      data: {
        clerkUserId,
        email: email || `${clerkUserId}@clerk.user`, // Fallback for safety
        name: name,
        avatar: clerkUser.imageUrl,
      },
    });
  }

  return user;
}
