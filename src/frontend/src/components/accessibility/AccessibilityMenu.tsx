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

export const AccessibilityMenu = () => {
  const { settings, updateSettings, resetSettings } = useAccessibility();
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    resetSettings();
    toast({
      title: 'Configurações restauradas',
      description: 'As configurações de acessibilidade foram restauradas para o padrão.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Abrir configurações de acessibilidade"
        >
          <Eye className="h-5 w-5" />
          <span className="sr-only">Acessibilidade</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" aria-hidden="true" />
            Configurações de Acessibilidade
          </DialogTitle>
          <DialogDescription>
            Personalize a interface para melhor atender suas necessidades de navegação
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Tamanho da Fonte */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" aria-hidden="true" />
              <Label className="text-base font-semibold">Tamanho da Fonte</Label>
            </div>
            <p className="text-sm text-muted-foreground">Ajuste o tamanho do texto em toda a plataforma</p>
            <RadioGroup
              value={settings.fontSize}
              onValueChange={(value) =>
                updateSettings({ fontSize: value as AccessibilitySettings['fontSize'] })
              }
              aria-label="Selecione o tamanho da fonte"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="font-normal" />
                <Label htmlFor="font-normal" className="cursor-pointer">Normal - Tamanho padrão de leitura</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="font-large" />
                <Label htmlFor="font-large" className="cursor-pointer">Grande - Texto maior para facilitar leitura</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="x-large" id="font-xlarge" />
                <Label htmlFor="font-xlarge" className="cursor-pointer">Muito Grande - Máxima legibilidade</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Peso da Fonte */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" aria-hidden="true" />
              <Label className="text-base font-semibold">Peso da Fonte</Label>
            </div>
            <p className="text-sm text-muted-foreground">Deixe o texto mais grosso para melhor contraste visual</p>
            <RadioGroup
              value={settings.fontWeight}
              onValueChange={(value) =>
                updateSettings({ fontWeight: value as AccessibilitySettings['fontWeight'] })
              }
              aria-label="Selecione o peso da fonte"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="weight-normal" />
                <Label htmlFor="weight-normal" className="cursor-pointer">Normal - Peso padrão</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bold" id="weight-bold" />
                <Label htmlFor="weight-bold" className="cursor-pointer font-bold">Negrito - Texto mais grosso e visível</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Modo Daltônico */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" aria-hidden="true" />
              <Label className="text-base font-semibold">Modo Daltônico</Label>
            </div>
            <p className="text-sm text-muted-foreground">Ajuste as cores para diferentes tipos de daltonismo</p>
            <RadioGroup
              value={settings.colorBlindMode}
              onValueChange={(value) =>
                updateSettings({ colorBlindMode: value as AccessibilitySettings['colorBlindMode'] })
              }
              aria-label="Selecione o modo de daltonismo"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="color-none" />
                <Label htmlFor="color-none" className="cursor-pointer">Nenhum - Cores padrão</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="protanopia" id="color-protanopia" />
                <Label htmlFor="color-protanopia" className="cursor-pointer">Protanopia - Deficiência de vermelho</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="deuteranopia" id="color-deuteranopia" />
                <Label htmlFor="color-deuteranopia" className="cursor-pointer">Deuteranopia - Deficiência de verde</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tritanopia" id="color-tritanopia" />
                <Label htmlFor="color-tritanopia" className="cursor-pointer">Tritanopia - Deficiência de azul</Label>
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
                  Alto Contraste
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">Aumenta o contraste entre texto e fundo</p>
            </div>
            <Switch
              id="high-contrast"
              checked={settings.highContrast}
              onCheckedChange={(checked) => updateSettings({ highContrast: checked })}
              aria-label="Ativar ou desativar alto contraste"
            />
          </div>

          <Separator />

          {/* Reduzir Movimento */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" aria-hidden="true" />
                <Label htmlFor="reduced-motion" className="text-base font-semibold cursor-pointer">
                  Reduzir Movimento
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">Diminui animações e efeitos de movimento</p>
            </div>
            <Switch
              id="reduced-motion"
              checked={settings.reducedMotion}
              onCheckedChange={(checked) => updateSettings({ reducedMotion: checked })}
              aria-label="Ativar ou desativar redução de movimento"
            />
          </div>

          <Separator />

          {/* Botão de Reset */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleReset}
            aria-label="Restaurar todas as configurações de acessibilidade para o padrão"
          >
            <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
            Restaurar Configurações Padrão
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
