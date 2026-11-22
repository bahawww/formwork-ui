import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { z } from 'zod';
import {
  Badge,
  Divider,
  PasswordInput,
  SpringSwitch,
  SurfaceCard,
  SurfaceCardBody,
  SurfaceCardFooter,
  SurfaceCardHeader,
  TactileButton,
  TextField,
  useOptionalToast,
} from '../ui';

export interface LoginPageProps {
  brandName?: string;
  subtitle?: string;
  onAuthenticate?: (payload: { email: string; remember: boolean }) => Promise<void> | void;
}

const SignInSchema = z.object({
  email: z.string().trim().email('Enter a valid work email address such as name@company.com.'),
  password: z.string().min(8, 'Password must be at least 8 characters to continue.'),
});

const ResetSchema = z.object({
  email: z.string().trim().email('Enter the email address associated with your account.'),
});

export function LoginPage({
  brandName = 'Formwork',
  subtitle = 'Sign in to continue to your workspace.',
  onAuthenticate,
}: LoginPageProps) {
  const [view, setView] = useState<'signin' | 'reset'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const toastApi = useOptionalToast();
  const reduceMotion = useReducedMotion();

  const switchView = (next: 'signin' | 'reset') => {
    setView(next);
    setFieldErrors({});
    setStatusNotice(null);
  };

  const handleSignIn = async (event: FormEvent) => {
    event.preventDefault();
    setStatusNotice(null);
    const parsed = SignInSchema.safeParse({ email, password });
    if (!parsed.success) {
      const nextErrors: { email?: string; password?: string } = {};
      for (const issue of parsed.error.issues) {
        if (issue.path[0] === 'email' && !nextErrors.email) nextErrors.email = issue.message;
        if (issue.path[0] === 'password' && !nextErrors.password) nextErrors.password = issue.message;
      }
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    setIsPending(true);
    try {
      await onAuthenticate?.({ email: parsed.data.email, remember });
      const msg = `Signed in as ${parsed.data.email}`;
      setStatusNotice(msg);
      toastApi?.toast({
        title: 'Signed in',
        description: parsed.data.email,
        tone: 'success',
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Sign in failed because the server rejected the credentials. Verify your password and retry.';
      setFieldErrors({ password: message });
    } finally {
      setIsPending(false);
    }
  };

  const handleReset = (event: FormEvent) => {
    event.preventDefault();
    const parsed = ResetSchema.safeParse({ email });
    if (!parsed.success) {
      setFieldErrors({ email: parsed.error.issues[0]?.message });
      return;
    }
    setFieldErrors({});
    const msg = `Reset link sent to ${parsed.data.email}`;
    setStatusNotice(msg);
    toastApi?.toast({
      title: 'Reset link sent',
      description: `Check ${parsed.data.email} to finish resetting your password.`,
      tone: 'neutral',
    });
  };

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div className="login-glow-bg rounded-xl squircle-corners border border-(--color-border) px-4 py-10 sm:px-8 sm:py-14 flex items-center justify-center">
      <SurfaceCard variant="glass" radius="xl" className="w-full max-w-[400px]">
        <SurfaceCardHeader>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[16px] text-(--color-fg)">{brandName}</span>
            <Badge variant="dot" tone="accent" size="sm">
              Workspace access
            </Badge>
          </div>
          <p className="m-0 mt-1 text-[13px] text-(--color-muted)">
            {view === 'signin'
              ? subtitle
              : 'Enter your account email and we will send a single-use reset link.'}
          </p>
        </SurfaceCardHeader>

        <AnimatePresence mode="wait">
          {view === 'signin' ? (
            <motion.form
              key="signin"
              onSubmit={(event) => void handleSignIn(event)}
              initial={reduceMotion ? false : { opacity: 0, filter: 'blur(2px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={reduceMotion ? undefined : { opacity: 0, filter: 'blur(2px)' }}
              transition={transition}
              noValidate
            >
              <SurfaceCardBody>
                <TextField
                  label="Work email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@company.com"
                  error={fieldErrors.email}
                />

                <PasswordInput
                  label="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Minimum 8 characters"
                  showStrength
                  error={fieldErrors.password}
                />

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <SpringSwitch
                    label="Keep me signed in"
                    checked={remember}
                    onCheckedChange={setRemember}
                  />
                  <TactileButton variant="ghost" size="sm" onClick={() => switchView('reset')}>
                    Forgot password
                  </TactileButton>
                </div>

                {statusNotice ? (
                  <p role="status" className="m-0 text-[13px] text-(--color-success)">
                    {statusNotice}
                  </p>
                ) : null}

                <TactileButton
                  type="submit"
                  variant="solid"
                  size="md"
                  loading={isPending}
                  loadingLabel="Signing in"
                  className="w-full"
                >
                  Sign in
                </TactileButton>

                <Divider label="or" />

                <TactileButton
                  variant="outline"
                  size="md"
                  className="w-full"
                  onClick={() =>
                    toastApi?.toast({
                      title: 'Passkey prompt ready',
                      description: 'Connect a hardware key or platform authenticator to sign in.',
                    })
                  }
                >
                  Continue with passkey
                </TactileButton>
              </SurfaceCardBody>
            </motion.form>
          ) : (
            <motion.form
              key="reset"
              onSubmit={handleReset}
              initial={reduceMotion ? false : { opacity: 0, filter: 'blur(2px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={reduceMotion ? undefined : { opacity: 0, filter: 'blur(2px)' }}
              transition={transition}
              noValidate
            >
              <SurfaceCardBody>
                <TextField
                  label="Account email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@company.com"
                  error={fieldErrors.email}
                />

                {statusNotice ? (
                  <p role="status" className="m-0 text-[13px] text-(--color-success)">
                    {statusNotice}
                  </p>
                ) : null}

                <TactileButton type="submit" variant="solid" size="md" className="w-full">
                  Send reset link
                </TactileButton>
              </SurfaceCardBody>
            </motion.form>
          )}
        </AnimatePresence>

        <SurfaceCardFooter>
          <span className="text-[12px] text-(--color-subtle)">Protected by session lock</span>
          {view === 'reset' ? (
            <TactileButton variant="ghost" size="sm" onClick={() => switchView('signin')}>
              Back to sign in
            </TactileButton>
          ) : (
            <span className="text-[12px] text-(--color-muted)">Single-tenant auth</span>
          )}
        </SurfaceCardFooter>
      </SurfaceCard>
    </div>
  );
}
