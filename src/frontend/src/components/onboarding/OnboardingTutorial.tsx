import { useState } from 'react';
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
import { useTranslation } from 'react-i18next';

interface OnboardingStep {
  titleKey: string;
  descriptionKey: string;
  icon: React.ReactNode;
  tipsKey?: string;
}

interface OnboardingTutorialProps {
  profile: 'borrower' | 'investor';
  open: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingTutorial = ({ profile, open, onComplete, onSkip }: OnboardingTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useTranslation();

  const borrowerSteps: OnboardingStep[] = [
    {
      titleKey: 'onboarding.borrower.steps.welcome.title',
      descriptionKey: 'onboarding.borrower.steps.welcome.description',
      icon: <Users className="w-16 h-16 text-primary mx-auto mb-4" />,
    },
    {
      titleKey: 'onboarding.borrower.steps.createRequest.title',
      descriptionKey: 'onboarding.borrower.steps.createRequest.description',
      icon: <CreditCard className="w-16 h-16 text-primary mx-auto mb-4" />,
      tipsKey: 'onboarding.borrower.steps.createRequest.tips'
    },
    {
      titleKey: 'onboarding.borrower.steps.findOffers.title',
      descriptionKey: 'onboarding.borrower.steps.findOffers.description',
      icon: <FileText className="w-16 h-16 text-primary mx-auto mb-4" />,
      tipsKey: 'onboarding.borrower.steps.findOffers.tips'
    },
    {
      titleKey: 'onboarding.borrower.steps.negotiate.title',
      descriptionKey: 'onboarding.borrower.steps.negotiate.description',
      icon: <HandshakeIcon className="w-16 h-16 text-primary mx-auto mb-4" />,
      tipsKey: 'onboarding.borrower.steps.negotiate.tips'
    },
    {
      titleKey: 'onboarding.shared.steps.switchProfile.title',
      descriptionKey: 'onboarding.shared.steps.switchProfile.description',
      icon: <ArrowLeftRight className="w-16 h-16 text-primary mx-auto mb-4" />,
      tipsKey: 'onboarding.shared.steps.switchProfile.tips'
    },
    {
      titleKey: 'onboarding.shared.steps.helpCenter.title',
      descriptionKey: 'onboarding.shared.steps.helpCenter.description',
      icon: <HelpCircle className="w-16 h-16 text-primary mx-auto mb-4" />,
    },
    {
      titleKey: 'onboarding.borrower.steps.notifications.title',
      descriptionKey: 'onboarding.borrower.steps.notifications.description',
      icon: <Bell className="w-16 h-16 text-primary mx-auto mb-4" />,
    },
    {
      titleKey: 'onboarding.shared.steps.accessibility.title',
      descriptionKey: 'onboarding.shared.steps.accessibility.description',
      icon: <Settings className="w-16 h-16 text-primary mx-auto mb-4" />,
      tipsKey: 'onboarding.shared.steps.accessibility.tips'
    },
  ];

  const investorSteps: OnboardingStep[] = [
    {
      titleKey: 'onboarding.investor.steps.welcome.title',
      descriptionKey: 'onboarding.investor.steps.welcome.description',
      icon: <Users className="w-16 h-16 text-primary mx-auto mb-4" />,
    },
    {
      titleKey: 'onboarding.investor.steps.createOffer.title',
      descriptionKey: 'onboarding.investor.steps.createOffer.description',
      icon: <CreditCard className="w-16 h-16 text-primary mx-auto mb-4" />,
      tipsKey: 'onboarding.investor.steps.createOffer.tips'
    },
    {
      titleKey: 'onboarding.investor.steps.findRequests.title',
      descriptionKey: 'onboarding.investor.steps.findRequests.description',
      icon: <FileText className="w-16 h-16 text-primary mx-auto mb-4" />,
      tipsKey: 'onboarding.investor.steps.findRequests.tips'
    },
    {
      titleKey: 'onboarding.investor.steps.negotiate.title',
      descriptionKey: 'onboarding.investor.steps.negotiate.description',
      icon: <HandshakeIcon className="w-16 h-16 text-primary mx-auto mb-4" />,
      tipsKey: 'onboarding.investor.steps.negotiate.tips'
    },
    {
      titleKey: 'onboarding.investor.steps.dashboard.title',
      descriptionKey: 'onboarding.investor.steps.dashboard.description',
      icon: <TrendingUp className="w-16 h-16 text-primary mx-auto mb-4" />,
      tipsKey: 'onboarding.investor.steps.dashboard.tips'
    },
    {
      titleKey: 'onboarding.investor.steps.advanceInstallments.title',
      descriptionKey: 'onboarding.investor.steps.advanceInstallments.description',
      icon: <ArrowLeftRight className="w-16 h-16 text-primary mx-auto mb-4" />,
      tipsKey: 'onboarding.investor.steps.advanceInstallments.tips'
    },
    {
      titleKey: 'onboarding.shared.steps.switchProfile.title',
      descriptionKey: 'onboarding.shared.steps.switchProfile.description',
      icon: <ArrowLeftRight className="w-16 h-16 text-primary mx-auto mb-4" />,
      tipsKey: 'onboarding.shared.steps.switchProfile.tips'
    },
    {
      titleKey: 'onboarding.shared.steps.helpCenter.title',
      descriptionKey: 'onboarding.shared.steps.helpCenter.description',
      icon: <HelpCircle className="w-16 h-16 text-primary mx-auto mb-4" />,
    },
    {
      titleKey: 'onboarding.investor.steps.notifications.title',
      descriptionKey: 'onboarding.investor.steps.notifications.description',
      icon: <Bell className="w-16 h-16 text-primary mx-auto mb-4" />,
    },
    {
      titleKey: 'onboarding.shared.steps.accessibility.title',
      descriptionKey: 'onboarding.shared.steps.accessibility.description',
      icon: <Settings className="w-16 h-16 text-primary mx-auto mb-4" />,
      tipsKey: 'onboarding.shared.steps.accessibility.tips'
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
  const tips = currentStepData.tipsKey
    ? (t(currentStepData.tipsKey, { returnObjects: true }) as string[])
    : undefined;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onSkip()}>
      <DialogContent className="sm:max-w-[500px]" aria-describedby="onboarding-description">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            {t(currentStepData.titleKey)}
          </DialogTitle>
          <DialogDescription id="onboarding-description" className="text-center text-base mt-2">
            {t(currentStepData.descriptionKey)}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {currentStepData.icon}

          {tips && tips.length > 0 && (
            <div className="mt-6 bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2 text-foreground">{t('onboarding.dialog.tipsTitle')}</h4>
              <ul className="space-y-2">
                {tips.map((tip, index) => (
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
              <span>{t('onboarding.dialog.stepProgress', { current: currentStep + 1, total: steps.length })}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={onSkip}
              className="w-full sm:w-auto"
              aria-label={t('onboarding.dialog.skipAria')}
            >
              {t('onboarding.dialog.skip')}
            </Button>

            <div className="flex gap-2 w-full sm:w-auto">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="flex-1 sm:flex-none"
                  aria-label={t('onboarding.dialog.previousAria')}
                >
                  {t('onboarding.dialog.previous')}
                </Button>
              )}

              <Button
                onClick={handleNext}
                className="flex-1 sm:flex-none"
                aria-label={currentStep === steps.length - 1 ? t('onboarding.dialog.finishAria') : t('onboarding.dialog.nextAria')}
              >
                {currentStep === steps.length - 1 ? t('onboarding.dialog.finish') : t('onboarding.dialog.next')}
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
