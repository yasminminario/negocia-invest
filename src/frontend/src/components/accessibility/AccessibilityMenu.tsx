import { useState } from 'react';
import { Eye, Type, Palette, Contrast, Zap, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { toast } from '@/hooks/use-toast';
import type { AccessibilitySettings } from '@/types';
import { useTranslation } from 'react-i18next';

export const AccessibilityMenu = () => {
  const { settings, updateSettings, resetSettings } = useAccessibility();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const handleReset = () => {
    resetSettings();
    toast({
      title: t('accessibility.reset.title'),
      description: t('accessibility.reset.description'),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('accessibility.triggerAria')}
        >
          <Eye className="h-5 w-5" />
          <span className="sr-only">{t('accessibility.triggerLabel')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" aria-hidden="true" />
            {t('accessibility.title')}
          </DialogTitle>
          <DialogDescription>
            {t('accessibility.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Tamanho da Fonte */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" aria-hidden="true" />
              <Label className="text-base font-semibold">{t('accessibility.fontSize.title')}</Label>
            </div>
            <p className="text-sm text-muted-foreground">{t('accessibility.fontSize.description')}</p>
            <RadioGroup
              value={settings.fontSize}
              onValueChange={(value) =>
                updateSettings({ fontSize: value as AccessibilitySettings['fontSize'] })
              }
              aria-label={t('accessibility.fontSize.aria')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="font-normal" />
                <Label htmlFor="font-normal" className="cursor-pointer">{t('accessibility.fontSize.normal')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="font-large" />
                <Label htmlFor="font-large" className="cursor-pointer">{t('accessibility.fontSize.large')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="x-large" id="font-xlarge" />
                <Label htmlFor="font-xlarge" className="cursor-pointer">{t('accessibility.fontSize.xLarge')}</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Peso da Fonte */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" aria-hidden="true" />
              <Label className="text-base font-semibold">{t('accessibility.fontWeight.title')}</Label>
            </div>
            <p className="text-sm text-muted-foreground">{t('accessibility.fontWeight.description')}</p>
            <RadioGroup
              value={settings.fontWeight}
              onValueChange={(value) =>
                updateSettings({ fontWeight: value as AccessibilitySettings['fontWeight'] })
              }
              aria-label={t('accessibility.fontWeight.aria')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="weight-normal" />
                <Label htmlFor="weight-normal" className="cursor-pointer">{t('accessibility.fontWeight.normal')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bold" id="weight-bold" />
                <Label htmlFor="weight-bold" className="cursor-pointer font-bold">{t('accessibility.fontWeight.bold')}</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Modo Daltônico */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" aria-hidden="true" />
              <Label className="text-base font-semibold">{t('accessibility.colorBlind.title')}</Label>
            </div>
            <p className="text-sm text-muted-foreground">{t('accessibility.colorBlind.description')}</p>
            <RadioGroup
              value={settings.colorBlindMode}
              onValueChange={(value) =>
                updateSettings({ colorBlindMode: value as AccessibilitySettings['colorBlindMode'] })
              }
              aria-label={t('accessibility.colorBlind.aria')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="color-none" />
                <Label htmlFor="color-none" className="cursor-pointer">{t('accessibility.colorBlind.none')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="protanopia" id="color-protanopia" />
                <Label htmlFor="color-protanopia" className="cursor-pointer">{t('accessibility.colorBlind.protanopia')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="deuteranopia" id="color-deuteranopia" />
                <Label htmlFor="color-deuteranopia" className="cursor-pointer">{t('accessibility.colorBlind.deuteranopia')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tritanopia" id="color-tritanopia" />
                <Label htmlFor="color-tritanopia" className="cursor-pointer">{t('accessibility.colorBlind.tritanopia')}</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Alto Contraste */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center gap-2">
                <Contrast className="h-4 w-4" aria-hidden="true" />
                <Label htmlFor="high-contrast" className="text-base font-semibold cursor-pointer">
                  {t('accessibility.highContrast.title')}
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">{t('accessibility.highContrast.description')}</p>
            </div>
            <Switch
              id="high-contrast"
              checked={settings.highContrast}
              onCheckedChange={(checked) => updateSettings({ highContrast: checked })}
              aria-label={t('accessibility.highContrast.aria')}
            />
          </div>

          <Separator />

          {/* Reduzir Movimento */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" aria-hidden="true" />
                <Label htmlFor="reduced-motion" className="text-base font-semibold cursor-pointer">
                  {t('accessibility.reducedMotion.title')}
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">{t('accessibility.reducedMotion.description')}</p>
            </div>
            <Switch
              id="reduced-motion"
              checked={settings.reducedMotion}
              onCheckedChange={(checked) => updateSettings({ reducedMotion: checked })}
              aria-label={t('accessibility.reducedMotion.aria')}
            />
          </div>

          <Separator />

          {/* Botão de Reset */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleReset}
            aria-label={t('accessibility.reset.aria')}
          >
            <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
            {t('accessibility.reset.button')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
