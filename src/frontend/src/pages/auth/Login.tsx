import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Fluxo mockado apenas para protótipo.
      toast({
        title: t('auth.login.toast.successTitle'),
        description: t('auth.login.toast.successDescription'),
      });
      navigate('/select-profile');
    } catch (error) {
      const message = error instanceof Error ? error.message : t('auth.login.toast.errorDescription');
      toast({
        title: t('auth.login.toast.errorTitle'),
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <LanguageSwitcher className="w-48 border-primary/70 bg-primary/15 text-primary font-medium shadow-lg" />
        </div>
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-10 h-10 text-primary" fill="currentColor">
                <path d="M20 8c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12S26.627 8 20 8zm0 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" />
                <circle cx="20" cy="20" r="4" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold">
            {t('app.name').replace('.ai', '')}
            <span className="text-primary">.ai</span>
          </h1>
          <p className="text-muted-foreground">{t('auth.login.subtitle')}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-card p-8 rounded-2xl border-2 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium" htmlFor="login-email">{t('auth.login.emailLabel')}</label>
              <Input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.login.emailPlaceholder')}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="login-password">{t('auth.login.passwordLabel')}</label>
              <Input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.login.passwordPlaceholder')}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full rounded-full py-6" disabled={loading}>
            {loading ? t('auth.login.loading') : t('auth.login.submit')}
          </Button>

          <div className="text-center text-sm text-muted-foreground flex flex-wrap items-center justify-center gap-1">
            <span>{t('auth.login.noAccount')}</span>
            <button
              type="button"
              onClick={() => navigate('/auth/signup')}
              className="text-primary font-medium hover:underline"
            >
              {t('auth.login.signUpLink')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
