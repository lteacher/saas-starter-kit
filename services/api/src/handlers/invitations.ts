import { Elysia } from 'elysia';
import { createInvitationSchema, acceptInvitationSchema } from '@saas-starter/schemas';
import {
  createInvitation,
  listInvitations,
  findInvitationByToken,
  cancelInvitation,
  acceptInvitation,
  findUserById,
  updateUser,
} from '@saas-starter/db';
import { NotFoundError, ConflictError } from '../lib/errors';
import { requireUsersCreate } from '../plugins/auth';
import { hashPassword } from '../utils/password';
import { sendInvitationEmail } from '../services/email-service';

export const invitationHandler = new Elysia({ prefix: '/invitations' })
  .use(requireUsersCreate)
  .get(
    '/',
    async () => {
      const invitations = await listInvitations();
      return invitations.map((invitation) => {
        const { _id, ...invitationData } = invitation;
        return {
          ...invitationData,
          id: `${_id}`,
        };
      });
    },
    {
      detail: { tags: ['Invitations'] },
    },
  )
  .get(
    '/:id',
    async ({ params }) => {
      const invitation = await findInvitationByToken(params.id);
      if (!invitation) throw new NotFoundError('Invitation');

      const { _id, ...invitationData } = invitation;
      return {
        ...invitationData,
        id: `${_id}`,
      };
    },
    {
      detail: { tags: ['Invitations'] },
    },
  )
  .use(requireUsersCreate)
  .post(
    '/',
    async ({ body, currentUser }) => {
      const newInvitation = await createInvitation({
        userId: body.userId,
        email: body.email,
        invitedBy: currentUser._id,
      });

      // Send invitation email
      try {
        await sendInvitationEmail({
          to: body.email,
          token: newInvitation.token,
          invitedByName:
            currentUser.firstName && currentUser.lastName
              ? `${currentUser.firstName} ${currentUser.lastName}`
              : currentUser.username,
          appName: process.env.APP_NAME || 'SaaS Starter Kit',
          baseUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
        });
      } catch (error) {
        console.warn('Failed to send invitation email:', error);
      }

      const { _id, ...invitationData } = newInvitation;
      return {
        ...invitationData,
        id: `${_id}`,
      };
    },
    {
      body: createInvitationSchema,
      detail: { tags: ['Invitations'] },
    },
  )
  .post(
    '/:id/accept',
    async ({ params, body }) => {
      const invitation = await findInvitationByToken(params.id);

      if (!invitation) {
        throw new NotFoundError('Invitation not found');
      }

      if (invitation.status !== 'pending') {
        throw new ConflictError('Invitation already used or expired');
      }

      if (invitation.expiresAt < new Date()) {
        throw new ConflictError('Invitation has expired');
      }

      const user = await findUserById(invitation.userId.toString());
      if (!user) {
        throw new NotFoundError('User not found');
      }

      const passwordHash = await hashPassword(body.password);
      await updateUser(invitation.userId.toString(), {
        passwordHash,
        status: 'active',
      });

      await acceptInvitation(params.id);

      return {
        userId: invitation.userId.toString(),
        message: 'Invitation accepted successfully',
      };
    },
    {
      body: acceptInvitationSchema,
      detail: { tags: ['Invitations'] },
    },
  )
  .delete(
    '/:id',
    async ({ params }) => {
      const invitation = await findInvitationByToken(params.id);
      if (!invitation) throw new NotFoundError('Invitation');

      await cancelInvitation(params.id);
      return { success: true };
    },
    {
      detail: { tags: ['Invitations'] },
    },
  );
