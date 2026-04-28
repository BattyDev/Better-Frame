import { useState } from 'react';
import { useAuthStore, type OAuthProvider } from '../../stores/authStore';

interface OAuthButtonsProps {
  withDivider?: boolean;
  onError: (message: string) => void;
}

interface ProviderConfig {
  id: OAuthProvider;
  label: string;
  icon: React.ReactNode;
}

const PROVIDERS: ProviderConfig[] = [
  {
    id: 'google',
    label: 'Continue with Google',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#EA4335"
          d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2s2.7-6.2 6-6.2c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3 14.6 2 12 2 6.9 2 2.8 6.1 2.8 12S6.9 22 12 22c6.9 0 11.5-4.9 11.5-11.7 0-.8-.1-1.4-.2-2.1H12z"
        />
      </svg>
    ),
  },
  {
    id: 'discord',
    label: 'Continue with Discord',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#5865F2"
          d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276c-.598.3428-1.2205.6447-1.8732.8914a.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"
        />
      </svg>
    ),
  },
];

export function OAuthButtons({ withDivider, onError }: OAuthButtonsProps) {
  const signInWithOAuth = useAuthStore((s) => s.signInWithOAuth);
  const [pending, setPending] = useState<OAuthProvider | null>(null);

  const handleClick = async (provider: OAuthProvider) => {
    setPending(provider);
    const result = await signInWithOAuth(provider);
    if (result.error) {
      setPending(null);
      onError(result.error);
    }
  };

  return (
    <div className="space-y-3">
      {withDivider && (
        <div className="flex items-center gap-3" aria-hidden="true">
          <div className="flex-1 border-t border-wf-border" />
          <span className="text-xs uppercase tracking-wider text-wf-text-muted">or</span>
          <div className="flex-1 border-t border-wf-border" />
        </div>
      )}
      {PROVIDERS.map((provider) => (
        <button
          key={provider.id}
          type="button"
          onClick={() => handleClick(provider.id)}
          disabled={pending !== null}
          className="w-full flex items-center justify-center gap-3 py-2 px-3 bg-wf-bg-light border border-wf-border rounded-lg text-wf-text hover:border-wf-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {provider.icon}
          <span className="text-sm font-medium">
            {pending === provider.id ? 'Redirecting...' : provider.label}
          </span>
        </button>
      ))}
    </div>
  );
}
