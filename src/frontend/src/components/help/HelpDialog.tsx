import { HelpCircle, ArrowRight, CheckCircle, TrendingUp, Handshake, DollarSign, FileText, Bell, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: 'borrower' | 'investor';
}

export const HelpDialog: React.FC<HelpDialogProps> = ({ open, onOpenChange, profile }) => {
  const isBorrower = profile === 'borrower';

  const borrowerContent = {
    title: 'Guia do Tomador',
    description: 'Aprenda a conseguir o empréstimo ideal para você',
    sections: [
      {
        id: 'what-is',
        icon: HelpCircle,
        title: 'O que é a negoci.ai?',
        content: (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              A negoci.ai conecta você diretamente com investidores que oferecem empréstimos. 
              Sem bancos, sem burocracia - apenas negociações diretas e transparentes.
            </p>
            <Card className="p-3 bg-borrower-light border-borrower/20">
              <p className="text-sm font-medium text-borrower-foreground">
                💡 Você tem o controle: negocie taxas, escolha prazos e aceite apenas ofertas que fazem sentido para você!
              </p>
            </Card>
          </div>
        ),
      },
      {
        id: 'how-to-start',
        icon: ArrowRight,
        title: 'Como começar?',
        content: (
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-borrower/20 flex items-center justify-center text-borrower-foreground font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-1">Crie uma Solicitação</h4>
                <p className="text-sm text-muted-foreground">
                  Defina quanto precisa, o prazo desejado e a taxa máxima que pode pagar.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-borrower/20 flex items-center justify-center text-borrower-foreground font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-1">Ou Busque Ofertas</h4>
                <p className="text-sm text-muted-foreground">
                  Navegue pelas ofertas disponíveis e escolha a que melhor se encaixa.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-borrower/20 flex items-center justify-center text-borrower-foreground font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-1">Negocie</h4>
                <p className="text-sm text-muted-foreground">
                  Use nossa ferramenta de negociação para ajustar valores e condições em tempo real.
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'negotiation',
        icon: Handshake,
        title: 'Como funciona a negociação?',
        content: (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Nossa plataforma possui sliders inteligentes que mostram o impacto de cada mudança:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-positive-foreground mt-0.5 flex-shrink-0" />
                <span>Ajuste valores e veja instantaneamente o impacto no pagamento mensal</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-positive-foreground mt-0.5 flex-shrink-0" />
                <span>Compare sua proposta com a oferta original lado a lado</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-positive-foreground mt-0.5 flex-shrink-0" />
                <span>Veja histórico completo de todas as propostas trocadas</span>
              </li>
            </ul>
            <Card className="p-3 bg-info-light border-info/20 mt-3">
              <p className="text-sm text-info-foreground">
                <Bell className="h-4 w-4 inline mr-1" />
                Você recebe notificações a cada nova contraproposta!
              </p>
            </Card>
          </div>
        ),
      },
      {
        id: 'score',
        icon: TrendingUp,
        title: 'Como funciona o Score?',
        content: (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Seu score é sua credibilidade na plataforma. Quanto maior, melhores as condições que você consegue:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Card className="p-3 text-center">
                <div className="text-2xl font-bold text-negative-foreground">0-400</div>
                <Badge variant="destructive" className="mt-1">Ruim</Badge>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-2xl font-bold text-warning-foreground">401-650</div>
                <Badge className="mt-1 bg-warning text-warning-foreground">Regular</Badge>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-2xl font-bold text-info-foreground">651-850</div>
                <Badge className="mt-1 bg-info text-info-foreground">Bom</Badge>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-2xl font-bold text-positive-foreground">851-1000</div>
                <Badge className="mt-1 bg-positive text-positive-foreground">Excelente</Badge>
              </Card>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Pague em dia, complete negociações com sucesso e seu score aumenta automaticamente!
            </p>
          </div>
        ),
      },
      {
        id: 'tips',
        icon: FileText,
        title: 'Dicas importantes',
        content: (
          <div className="space-y-2">
            <Card className="p-3 border-l-4 border-l-positive">
              <p className="text-sm font-medium">✅ Compare sempre várias ofertas antes de decidir</p>
            </Card>
            <Card className="p-3 border-l-4 border-l-positive">
              <p className="text-sm font-medium">✅ Use o simulador para entender o impacto total do empréstimo</p>
            </Card>
            <Card className="p-3 border-l-4 border-l-positive">
              <p className="text-sm font-medium">✅ Negocie! Investidores querem fechar negócio tanto quanto você</p>
            </Card>
            <Card className="p-3 border-l-4 border-l-warning">
              <p className="text-sm font-medium">⚠️ Só aceite condições que você tem certeza que pode cumprir</p>
            </Card>
          </div>
        ),
      },
    ],
  };

  const investorContent = {
    title: 'Guia do Investidor',
    description: 'Aprenda a investir e gerar retorno com empréstimos',
    sections: [
      {
        id: 'what-is',
        icon: HelpCircle,
        title: 'O que é a negoci.ai?',
        content: (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              A negoci.ai é um marketplace de empréstimos peer-to-peer (P2P). Você empresta dinheiro 
              diretamente para pessoas e recebe juros pelo período acordado.
            </p>
            <Card className="p-3 bg-investor-light border-investor/20">
              <p className="text-sm font-medium text-investor-foreground">
                💰 Rentabilidade: Taxas de retorno geralmente superiores a investimentos tradicionais!
              </p>
            </Card>
          </div>
        ),
      },
      {
        id: 'how-to-start',
        icon: ArrowRight,
        title: 'Como começar a investir?',
        content: (
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-investor/20 flex items-center justify-center text-investor-foreground font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-1">Crie uma Oferta</h4>
                <p className="text-sm text-muted-foreground">
                  Defina quanto quer emprestar, prazo, taxa de juros e score mínimo aceitável.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-investor/20 flex items-center justify-center text-investor-foreground font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-1">Ou Busque Solicitações</h4>
                <p className="text-sm text-muted-foreground">
                  Navegue por solicitações de tomadores e escolha as melhores oportunidades.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-investor/20 flex items-center justify-center text-investor-foreground font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-1">Negocie e Invista</h4>
                <p className="text-sm text-muted-foreground">
                  Ajuste condições, negocie com o tomador e finalize o empréstimo.
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'risk',
        icon: TrendingUp,
        title: 'Como avaliar o risco?',
        content: (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Use o score do tomador como principal indicador de risco:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Card className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-positive" />
                  <span className="text-sm font-semibold">851-1000</span>
                </div>
                <p className="text-xs text-muted-foreground">Baixo risco - Histórico excelente</p>
              </Card>
              <Card className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-info" />
                  <span className="text-sm font-semibold">651-850</span>
                </div>
                <p className="text-xs text-muted-foreground">Risco moderado - Bom histórico</p>
              </Card>
              <Card className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span className="text-sm font-semibold">401-650</span>
                </div>
                <p className="text-xs text-muted-foreground">Risco médio-alto - Atenção</p>
              </Card>
              <Card className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-negative" />
                  <span className="text-sm font-semibold">0-400</span>
                </div>
                <p className="text-xs text-muted-foreground">Alto risco - Muito cuidado</p>
              </Card>
            </div>
            <Card className="p-3 bg-warning-light border-warning/20 mt-3">
              <p className="text-sm text-warning-foreground">
                ⚠️ Diversifique! Nunca coloque todo seu capital em um único empréstimo.
              </p>
            </Card>
          </div>
        ),
      },
      {
        id: 'portfolio',
        icon: DollarSign,
        title: 'Gerenciando seu portfólio',
        content: (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Seu dashboard mostra métricas importantes em tempo real:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-positive-foreground mt-0.5 flex-shrink-0" />
                <span><strong>Total Investido:</strong> Quanto você tem aplicado atualmente</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-positive-foreground mt-0.5 flex-shrink-0" />
                <span><strong>Retorno Total:</strong> Juros acumulados de todos os empréstimos</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-positive-foreground mt-0.5 flex-shrink-0" />
                <span><strong>Diversificação:</strong> Distribuição por score dos tomadores</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-positive-foreground mt-0.5 flex-shrink-0" />
                <span><strong>Taxa Média:</strong> Rentabilidade média de sua carteira</span>
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: 'tips',
        icon: FileText,
        title: 'Estratégias de sucesso',
        content: (
          <div className="space-y-2">
            <Card className="p-3 border-l-4 border-l-positive">
              <p className="text-sm font-medium">✅ Diversifique entre diferentes scores e valores</p>
            </Card>
            <Card className="p-3 border-l-4 border-l-positive">
              <p className="text-sm font-medium">✅ Prefira prazos mais curtos para reduzir risco</p>
            </Card>
            <Card className="p-3 border-l-4 border-l-positive">
              <p className="text-sm font-medium">✅ Negocie ativamente - taxas melhores = mais retorno</p>
            </Card>
            <Card className="p-3 border-l-4 border-l-info">
              <p className="text-sm font-medium">💡 Reinvista os retornos para efeito composto</p>
            </Card>
          </div>
        ),
      },
    ],
  };

  const content = isBorrower ? borrowerContent : investorContent;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isBorrower ? 'bg-borrower/20' : 'bg-investor/20'
            }`}>
              <HelpCircle className={`h-5 w-5 ${
                isBorrower ? 'text-borrower-foreground' : 'text-investor-foreground'
              }`} />
            </div>
            <div>
              <DialogTitle className="text-2xl">{content.title}</DialogTitle>
              <DialogDescription>{content.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Accordion type="single" collapsible className="w-full mt-4">
          {content.sections.map((section) => (
            <AccordionItem key={section.id} value={section.id}>
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <section.icon className={`h-4 w-4 ${
                    isBorrower ? 'text-borrower-foreground' : 'text-investor-foreground'
                  }`} />
                  <span>{section.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                {section.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Card className={`p-4 mt-4 ${
          isBorrower ? 'bg-borrower-light border-borrower/20' : 'bg-investor-light border-investor/20'
        }`}>
          <div className="flex items-start gap-3">
            <User className={`h-5 w-5 mt-0.5 ${
              isBorrower ? 'text-borrower-foreground' : 'text-investor-foreground'
            }`} />
            <div>
              <h4 className="font-semibold mb-1">Precisa de mais ajuda?</h4>
              <p className="text-sm text-muted-foreground">
                Explore a plataforma e use as notificações para acompanhar todas as atualizações. 
                Qualquer dúvida, revise este guia a qualquer momento!
              </p>
            </div>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
