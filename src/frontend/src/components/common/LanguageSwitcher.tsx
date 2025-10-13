import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
    className?: string;
}

const supportedLanguages = ['pt', 'en', 'es'] as const;

type SupportedLanguage = typeof supportedLanguages[number];

export const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
    const { i18n, t } = useTranslation();

    const currentLanguage = useMemo<SupportedLanguage>(() => {
        const lang = i18n.resolvedLanguage || i18n.language || 'pt';
        if (supportedLanguages.includes(lang as SupportedLanguage)) {
            return lang as SupportedLanguage;
        }

        const short = lang.split('-')[0] as SupportedLanguage;
        return supportedLanguages.includes(short) ? short : 'pt';
    }, [i18n.language, i18n.resolvedLanguage]);

    useEffect(() => {
        const htmlLangMap: Record<SupportedLanguage, string> = {
            pt: 'pt-BR',
            en: 'en-US',
            es: 'es-ES',
        };

        document.documentElement.lang = htmlLangMap[currentLanguage] ?? currentLanguage;
        localStorage.setItem('i18nextLng', currentLanguage);
    }, [currentLanguage]);

    const handleChange = useCallback(async (value: string) => {
        await i18n.changeLanguage(value);
    }, [i18n]);

    return (
        <Select value={currentLanguage} onValueChange={handleChange}>
            <SelectTrigger className={cn('w-40 rounded-full border-border/60 bg-muted/30 text-sm', className)} aria-label={t('language.label')}>
                <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" aria-hidden="true" />
                    <SelectValue placeholder={t('language.label')} />
                </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
                {supportedLanguages.map((lang) => (
                    <SelectItem key={lang} value={lang} className="capitalize">
                        {t(`language.${lang}`)}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
