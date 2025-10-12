import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { ScoreRing } from '@/components/common/ScoreRing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useProfile } from '@/contexts/ProfileContext';
import { User, Mail, Shield, LogOut, Edit2, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const UserProfile = () => {
  const navigate = useNavigate();
  const { activeProfile, user, score, logout, isLoading, error } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.nome || '',
    email: user?.email || '',
    phone: user?.celular_mascarado || '',
    cpf: user?.cpf_mascarado || '',
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.nome || '',
        email: user.email || '',
        phone: user.celular_mascarado || '',
        cpf: user.cpf_mascarado || '',
      });
    }
  }, [user]);

  const handleSave = () => {
    toast({
      title: 'Perfil atualizado!',
      description: 'Suas informações foram salvas com sucesso.',
      variant: activeProfile === 'borrower' ? 'borrower' : 'investor',
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    toast({
      title: 'Logout realizado',
      description: 'Você saiu da sua conta.',
      variant: 'success',
    });
    navigate('/');
  };

  const isDashboardRoute = activeProfile === 'borrower' ? '/borrower/dashboard' : '/investor/dashboard';

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton onBack={() => navigate(isDashboardRoute)} />

      <main className="container max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-10 h-10 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{formData.name}</h1>
            <p className="text-sm text-muted-foreground capitalize">
              {activeProfile === 'borrower' ? 'Tomador' : 'Investidor'}
            </p>
          </div>
        </div>

        {/* Score Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Seu Score</h2>
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div className="flex items-center justify-center">
            <ScoreRing score={score?.valor_score || 0} size="lg" />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Score excelente! Continue mantendo seus pagamentos em dia.
          </p>
        </Card>

        {(isLoading || !user) && (
          <Card className="p-4 border-border/80 bg-muted/40 text-sm text-muted-foreground">
            Carregando dados do perfil...
          </Card>
        )}

        {!isLoading && error && (
          <Card className="p-4 border-destructive/40 bg-destructive/10 text-sm text-destructive">
            {error}
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal" className="space-y-4 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Informações Pessoais</h3>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  disabled
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Por segurança, exibimos apenas os últimos dígitos.
                </p>
              </div>

              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  disabled
                  className="mt-1 bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  CPF não pode ser alterado e permanece oculto.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Segurança da Conta
            </h3>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Alterar senha</p>
                  <p className="text-sm text-muted-foreground">
                    Última alteração há 3 meses
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Alterar
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Autenticação em 2 fatores</p>
                  <p className="text-sm text-muted-foreground">
                    Adicione uma camada extra de segurança
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Ativar
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Sessões ativas</p>
                  <p className="text-sm text-muted-foreground">
                    Gerencie seus dispositivos conectados
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Ver
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Logout Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full" size="lg">
              <LogOut className="w-5 h-5 mr-2" />
              Sair da conta
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="border-destructive/20">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-destructive">Sair da conta</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja sair? Você precisará fazer login novamente para
                acessar sua conta.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                Confirmar saída
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default UserProfile;
