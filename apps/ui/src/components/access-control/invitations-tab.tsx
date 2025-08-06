import { component$ } from '@builder.io/qwik';

interface Invitation {
  id: string;
  email: string;
  status: 'pending' | 'accepted' | 'expired';
  invitedBy: string;
  createdAt: string;
  expiresAt?: string;
}

interface InvitationsTabProps {
  invitations: Invitation[];
}

export const InvitationsTab = component$<InvitationsTabProps>(({ invitations }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'badge badge-warning';
      case 'accepted':
        return 'badge badge-success';
      case 'expired':
        return 'badge badge-error';
      default:
        return 'badge badge-neutral';
    }
  };

  return (
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex-1">
          <input
            type="text"
            placeholder="Search invitations..."
            class="input input-bordered w-full max-w-md"
          />
        </div>
        <button class="btn btn-primary">Send Invitation</button>
      </div>

      {invitations.length === 0 ? (
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body text-center py-8">
            <p class="text-base-content/70">No invitations found</p>
          </div>
        </div>
      ) : (
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body p-0">
            <div class="overflow-x-auto">
              <table class="table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Invited By</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invitations.map((invitation) => (
                    <tr key={invitation.id}>
                      <td class="font-medium">{invitation.email}</td>
                      <td>
                        <span class={getStatusBadge(invitation.status)}>{invitation.status}</span>
                      </td>
                      <td class="text-sm text-base-content/70">{invitation.invitedBy}</td>
                      <td class="text-sm text-base-content/70">
                        {new Date(invitation.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div class="flex gap-2">
                          <button class="btn btn-ghost btn-sm">Resend</button>
                          <button class="btn btn-ghost btn-sm text-error">Cancel</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
