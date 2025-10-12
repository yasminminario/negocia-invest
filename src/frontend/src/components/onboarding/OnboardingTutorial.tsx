import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  Users, 
  HandshakeIcon, 
  HelpCircle, 
  Settings,
  TrendingUp,
  FileText,
  Bell,
  ArrowLeftRight
} from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  tips?: string[];
}

interface OnboardingTutorialProps {
  profile: 'borrower' | 'investor';
  open: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingTutorial = ({ profile, open, onComplete, onSkip }: OnboardingTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const borrowerSteps: OnboardingStep[] = [
    {
      title: 'Bem-vindo ao negoci.ai! 🎉',
      description: 'Vamos fazer um tour rápido pela plataforma para você conhecer todas as funcionalidades disponíveis.',
      icon: <Users className="w-16 h-16 text-primary mx-auto mb-4" />,
    },
    {
      title: 'Solicitar Empréstimo',
      description: 'Crie suas solicitações de empréstimo de forma simples e rápida. Defina o valor, prazo e condições que você precisa.',
      icon: <CreditCard className="w-16 h-16 text-primary mx-auto mb-4" />,
      tips: ['Seja específico sobre suas necessidades', 'Quanto mais detalhes, melhores ofertas você recebe']
    },
    {
      title: 'Encontrar Ofertas',
      description: 'Navegue por ofertas disponíveis de investidores. Use os filtros para encontrar as melhores condições para você.',
      icon: <FileText className="w-16 h-16 text-primary mx-auto mb-4" />,
      tips: ['Compare taxas de juros', 'Avalie o prazo de pagamento', 'Verifique o score do investidor']
    },
    {
      title: 'Negociar',
      description: 'Negocie taxas e condições diretamente com investidores. Faça contrapropostas e chegue ao melhor acordo.',
      icon: <HandshakeIcon className="w-16 h-16 text-primary mx-auto mb-4" />,
      tips: ['Use o chat para esclarecer dúvidas', 'Seja flexível nas negociações', 'Acompanhe suas negociações ativas']
    },
    {
      title: 'Trocar de Perfil',
      description: 'Você pode alternar entre perfil de Tomador e Investidor a qualquer momento. Assim você pode emprestar e investir!',
      icon: <ArrowLeftRight className="w-16 h-16 text-primary mx-auto mb-4" />,
      tips: ['Explore as duas perspectivas', 'Entenda como funciona do outro lado']
    },
    {
      title: 'Central de Ajuda',
      description: 'Acesse dicas e orientações na Central de Ajuda, disponível no menu superior. Sempre que precisar de ajuda, é só clicar!',
      icon: <HelpCircle className="w-16 h-16 text-primary mx-auto mb-4" />,
    },
    {
      title: 'Notificações',
      description: 'Fique por dentro de novas ofertas, mensagens e atualizações através do sino de notificações.',
      icon: <Bell className="w-16 h-16 text-primary mx-auto mb-4" />,
    },
    {
      title: 'Acessibilidade',
      description: 'Personalize sua experiência! Ajuste tamanho de texto, contraste, animações e navegue por toda a plataforma usando apenas o teclado.',
      icon: <Settings className="w-16 h-16 text-primary mx-auto mb-4" />,
      tips: ['Ajuste para suas necessidades', 'Use Tab para navegar', 'Ative legendas de voz se precisar']
    },
  ];

  const investorSteps: OnboardingStep[] = [
    {
      title: 'Bem-vindo ao negoci.ai! 🎉',
      description: 'Vamos fazer um tour rápido pela plataforma para você conhecer todas as funcionalidades disponíveis.',
      icon: <Users className="w-16 h-16 text-primary mx-auto mb-4" />,
    },
    {
      title: 'Ofertar Empréstimo',
      description: 'Crie ofertas de empréstimo e defina suas condições: valor, taxa de juros, prazo e score mínimo desejado.',
      icon: <CreditCard className="w-16 h-16 text-primary mx-auto mb-4" />,
      tips: ['Defina condições competitivas', 'Considere seu perfil de risco', 'Diversifique seu portfólio']
    },
    {
      title: 'Encontrar Solicitações',
      description: 'Explore solicitações de tomadores e encontre as melhores oportunidades de investimento usando filtros inteligentes.',
      icon: <FileText className="w-16 h-16 text-primary mx-auto mb-4" />,
      tips: ['Analise o score do tomador', 'Verifique o histórico', 'Compare diferentes solicitações']
    },
    {
      title: 'Negociar',
      description: 'Negocie diretamente com tomadores. Ajuste condições, faça contrapropostas e feche os melhores negócios.',
      icon: <HandshakeIcon className="w-16 h-16 text-primary mx-auto mb-4" />,
      tips: ['Seja claro nas suas condições', 'Responda rápido às propostas', 'Mantenha uma comunicação profissional']
    },
    {
      title: 'Acompanhar Investimentos',
      description: 'Monitore seus empréstimos ativos, acompanhe pagamentos e veja o retorno dos seus investimentos em tempo real.',
      icon: <TrendingUp className="w-16 h-16 text-primary mx-auto mb-4" />,
      tips: ['Verifique regularmente seus retornos', 'Diversifique seus investimentos', 'Acompanhe o histórico de pagamentos']
    },
    {
      title: 'Trocar de Perfil',
      description: 'Você pode alternar entre perfil de Investidor e Tomador a qualquer momento. Explore ambas as perspectivas!',
      icon: <ArrowLeftRight className="w-16 h-16 text-primary mx-auto mb-4" />,
      tips: ['Entenda ambos os lados da plataforma', 'Tome decisões mais informadas']
    },
    {
      title: 'Central de Ajuda',
      description: 'Acesse dicas e orientações na Central de Ajuda, disponível no menu superior. Sempre que precisar de ajuda, é só clicar!',
      icon: <HelpCircle className="w-16 h-16 text-primary mx-auto mb-4" />,
    },
    {
      title: 'Notificações',
      description: 'Fique por dentro de novas solicitações, mensagens de tomadores e atualizações através do sino de notificações.',
      icon: <Bell className="w-16 h-16 text-primary mx-auto mb-4" />,
    },
    {
      title: 'Acessibilidade',
      description: 'Personalize sua experiência! Ajuste tamanho de texto, contraste, animações e navegue por toda a plataforma usando apenas o teclado.',
      icon: <Settings className="w-16 h-16 text-primary mx-auto mb-4" />,
      tips: ['Ajuste para suas necessidades', 'Use Tab para navegar', 'Ative legendas de voz se precisar']
    },
  ];

  const steps = profile === 'borrower' ? borrowerSteps : investorSteps;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onSkip()}>
      <DialogContent className="sm:max-w-[500px]" aria-describedby="onboarding-description">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            {currentStepData.title}
          </DialogTitle>
          <DialogDescription id="onboarding-description" className="text-center text-base mt-2">
            {currentStepData.description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {currentStepData.icon}
          
          {currentStepData.tips && (
            <div className="mt-6 bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2 text-foreground">💡 Dicas importantes:</h4>
              <ul className="space-y-2">
                {currentStepData.tips.map((tip, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start">
                    <span className="mr-2">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Passo {currentStep + 1} de {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={onSkip}
              className="w-full sm:w-auto"
              aria-label="Pular introdução"
            >
              Pular introdução
            </Button>
            
            <div className="flex gap-2 w-full sm:w-auto">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="flex-1 sm:flex-none"
                  aria-label="Voltar para o passo anterior"
                >
                  Anterior
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                className="flex-1 sm:flex-none"
                aria-label={currentStep === steps.length - 1 ? "Finalizar introdução" : "Próximo passo"}
              >
                {currentStep === steps.length - 1 ? 'Começar!' : 'Próximo'}
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
