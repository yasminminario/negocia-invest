import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const SignUp = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: t('auth.signUp.toast.mismatchTitle'),
        description: t('auth.signUp.toast.mismatchDescription'),
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: t('auth.signUp.toast.mismatchTitle'),
        description: t('auth.signUp.toast.shortPassword'),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Fluxo mockado apenas para protótipo.
      toast({
        title: t('auth.signUp.toast.successTitle'),
        description: t('auth.signUp.toast.successDescription'),
      });
      navigate('/auth/login');
    } catch (error) {
      const message = error instanceof Error ? error.message : t('auth.signUp.toast.errorDescription');
      toast({
        title: t('auth.signUp.toast.errorTitle'),
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
          <p className="text-muted-foreground">{t('auth.signUp.subtitle')}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp} className="bg-card p-8 rounded-2xl border-2 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium" htmlFor="signup-name">{t('auth.signUp.nameLabel')}</label>
              <Input
                id="signup-name"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder={t('auth.signUp.namePlaceholder')}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="signup-email">{t('auth.signUp.emailLabel')}</label>
              <Input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.signUp.emailPlaceholder')}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="signup-password">{t('auth.signUp.passwordLabel')}</label>
              <Input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.signUp.passwordPlaceholder')}
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="signup-password-confirm">{t('auth.signUp.confirmPasswordLabel')}</label>
              <Input
                id="signup-password-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('auth.signUp.passwordPlaceholder')}
                required
                minLength={6}
              />
            </div>
          </div>

          <Button type="submit" className="w-full rounded-full py-6" disabled={loading}>
            {loading ? t('auth.signUp.loading') : t('auth.signUp.submit')}
          </Button>

          <div className="text-center text-sm text-muted-foreground flex flex-wrap items-center justify-center gap-1">
            <span>{t('auth.signUp.haveAccount')}</span>
            <button
              type="button"
              onClick={() => navigate('/auth/login')}
              className="text-primary font-medium hover:underline"
            >
              {t('auth.signUp.loginLink')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
