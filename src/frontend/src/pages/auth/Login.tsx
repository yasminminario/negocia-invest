import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProfile } from '@/contexts/ProfileContext';
import { mockBorrower } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login
    setUser(mockBorrower);
    toast({
      title: "Login realizado!",
      description: "Bem-vindo ao negocia.ai",
      variant: "success",
    });
    navigate('/select-profile');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md space-y-8">
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
            negoci<span className="text-primary">.ai</span>
          </h1>
          <p className="text-muted-foreground">Empréstimos P2P com negociação justa</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-card p-8 rounded-2xl border-2 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Senha</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full rounded-full py-6">
            Entrar
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <span>Não tem conta? </span>
            <button type="button" className="text-primary font-medium">
              Cadastre-se
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
