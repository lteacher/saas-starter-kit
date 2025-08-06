import { ObjectId } from 'mongodb';
import { db } from '../connection';
import type { Invitation } from '../types';

export const listInvitations = async (): Promise<Invitation[]> => {
  return db
    .collection<Invitation>('invitations')
    .find({ status: { $ne: 'cancelled' } })
    .sort({ createdAt: -1 })
    .toArray();
};

export const findInvitationByToken = async (token: string): Promise<Invitation | null> => {
  return db.collection<Invitation>('invitations').findOne({ token });
};

export const findInvitationByEmail = async (email: string): Promise<Invitation | null> => {
  return db.collection<Invitation>('invitations').findOne({
    email,
    status: 'pending',
  });
};

export const createInvitation = async (invitationData: {
  userId: string;
  email: string;
  invitedBy: ObjectId;
}): Promise<Invitation> => {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const token = await generateUniqueToken();

  const newInvitation: Omit<Invitation, '_id'> = {
    userId: new ObjectId(invitationData.userId),
    email: invitationData.email,
    token,
    invitedBy: invitationData.invitedBy,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
    expiresAt,
  };

  const result = await db
    .collection<Invitation>('invitations')
    .insertOne(newInvitation as Invitation);
  return { ...newInvitation, _id: result.insertedId };
};

export const updateInvitationStatus = async (
  token: string,
  status: 'accepted' | 'expired' | 'cancelled',
): Promise<void> => {
  await db.collection<Invitation>('invitations').updateOne(
    { token },
    {
      $set: {
        status,
        updatedAt: new Date(),
      },
    },
  );
};

export const cancelInvitation = async (token: string): Promise<void> => {
  await updateInvitationStatus(token, 'cancelled');
};

export const acceptInvitation = async (token: string): Promise<void> => {
  await updateInvitationStatus(token, 'accepted');
};

async function generateUniqueToken(): Promise<string> {
  // Use crypto.randomUUID() for guaranteed uniqueness
  return crypto.randomUUID().replace(/-/g, '');
}
