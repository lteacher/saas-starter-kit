import { component$ } from '@builder.io/qwik';
import type { DocumentHead, RequestHandler } from '@builder.io/qwik-city';

// Redirect authenticated users to dashboard
export const onRequest: RequestHandler = async ({ cookie, redirect }) => {
  const authToken = cookie.get('auth_token')?.value;
  const storedUser = cookie.get('auth_user')?.value;

  if (authToken && storedUser) {
    throw redirect(302, '/dashboard');
  }
};

export default component$(() => {
  return (
    <div class="min-h-screen bg-base-100 p-8">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-4xl font-bold text-primary mb-4">SaaS Starter Kit 🚀</h1>
        <div class="card bg-base-200 shadow-xl">
          <div class="card-body">
            <h2 class="card-title text-2xl">TailwindCSS + DaisyUI Setup Complete!</h2>
            <p class="text-base-content/70">Your Qwik app is now ready with modern styling.</p>
            <div class="card-actions justify-end mt-4">
              <a href="/login" class="btn btn-primary">
                Sign In
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};
