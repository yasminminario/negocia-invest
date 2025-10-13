import {
  HelpCircle,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Handshake,
  DollarSign,
  FileText,
  Bell,
  User,
  ArrowLeftRight,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: "borrower" | "investor";
}

export const HelpDialog: React.FC<HelpDialogProps> = ({ open, onOpenChange, profile }) => {
  const { t } = useTranslation();
  const isBorrower = profile === "borrower";

  const borrowerContent = {
    title: t("helpDialog.borrower.title"),
    description: t("helpDialog.borrower.description"),
    sections: [
      {
        id: "what-is",
        icon: HelpCircle,
        title: t("helpDialog.borrower.sections.whatIs.title"),
        content: (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t("helpDialog.borrower.sections.whatIs.description")}
            </p>
            <Card className="p-3 bg-borrower border-borrower/20">
              <p className="text-sm font-medium text-borrower-foreground">
                {t("helpDialog.borrower.sections.whatIs.tip")}
              </p>
            </Card>
          </div>
        ),
      },
      {
        id: "how-to-start",
        icon: ArrowRight,
        title: t("helpDialog.borrower.sections.howToStart.title"),
        content: (
          <div className="space-y-4">
            {(t("helpDialog.borrower.sections.howToStart.steps", { returnObjects: true }) as Array<{ title: string; description: string }>).map((step, index) => (
              <div className="flex gap-3" key={step.title}>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-borrower flex items-center justify-center text-borrower-foreground font-bold">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ),
      },
      {
        id: "negotiation",
        icon: Handshake,
        title: t("helpDialog.borrower.sections.negotiation.title"),
        content: (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t("helpDialog.borrower.sections.negotiation.description")}
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {(t("helpDialog.borrower.sections.negotiation.items", { returnObjects: true }) as string[]).map((item) => (
                <li className="flex items-start gap-2" key={item}>
                  <CheckCircle className="h-4 w-4 text-positive-foreground mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Card className="p-3 bg-info-light border-info mt-3">
              <p className="text-sm text-info">
                <Bell className="h-4 w-4 inline mr-1" />
                {t("helpDialog.borrower.sections.negotiation.notification")}
              </p>
            </Card>
          </div>
        ),
      },
      {
        id: "score",
        icon: TrendingUp,
        title: t("helpDialog.borrower.sections.score.title"),
        content: (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t("helpDialog.borrower.sections.score.description")}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Card className="p-3 text-center">
                <div className="text-2xl font-bold text-negative">0-400</div>
                <Badge variant="destructive" className="mt-1">
                  {t("helpDialog.shared.scoreLabels.poor")}
                </Badge>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-2xl font-bold text-warning">401-650</div>
                <Badge className="mt-1 bg-warning text-warning-foreground">{t("helpDialog.shared.scoreLabels.fair")}</Badge>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-2xl font-bold text-info">651-850</div>
                <Badge className="mt-1 bg-info text-info-foreground">{t("helpDialog.shared.scoreLabels.good")}</Badge>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-2xl font-bold text-positive">851-1000</div>
                <Badge className="mt-1 bg-positive text-positive-foreground">{t("helpDialog.shared.scoreLabels.excellent")}</Badge>
              </Card>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              {t("helpDialog.borrower.sections.score.footer")}
            </p>
          </div>
        ),
      },
      {
        id: "tips",
        icon: FileText,
        title: t("helpDialog.borrower.sections.tips.title"),
        content: (
          <div className="space-y-2">
            {(t("helpDialog.borrower.sections.tips.items", { returnObjects: true }) as Array<{ text: string; variant: "positive" | "warning" }>).map((item) => (
              <Card
                key={item.text}
                className={`p-3 border-l-4 ${item.variant === "warning" ? "border-l-warning" : "border-l-positive"}`}
              >
                <p className="text-sm font-medium">{item.text}</p>
              </Card>
            ))}
          </div>
        ),
      },
    ],
  };

  const investorContent = {
    title: t("helpDialog.investor.title"),
    description: t("helpDialog.investor.description"),
    sections: [
      {
        id: "what-is",
        icon: HelpCircle,
        title: t("helpDialog.investor.sections.whatIs.title"),
        content: (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t("helpDialog.investor.sections.whatIs.description")}
            </p>
            <Card className="p-3 bg-investor border-investor/20">
              <p className="text-sm font-medium text-investor-foreground">
                {t("helpDialog.investor.sections.whatIs.tip")}
              </p>
            </Card>
          </div>
        ),
      },
      {
        id: "how-to-start",
        icon: ArrowRight,
        title: t("helpDialog.investor.sections.howToStart.title"),
        content: (
          <div className="space-y-4">
            {(t("helpDialog.investor.sections.howToStart.steps", { returnObjects: true }) as Array<{ title: string; description: string }>).map((step, index) => (
              <div className="flex gap-3" key={step.title}>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-investor flex items-center justify-center text-investor-foreground font-bold">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ),
      },
      {
        id: "risk",
        icon: TrendingUp,
        title: t("helpDialog.investor.sections.risk.title"),
        content: (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{t("helpDialog.investor.sections.risk.description")}</p>
            <div className="grid grid-cols-2 gap-2">
              <Card className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-positive" />
                  <span className="text-sm font-semibold">851-1000</span>
                </div>
                <p className="text-xs text-muted-foreground">{t("helpDialog.investor.sections.risk.labels.low")}</p>
              </Card>
              <Card className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-info" />
                  <span className="text-sm font-semibold">651-850</span>
                </div>
                <p className="text-xs text-muted-foreground">{t("helpDialog.investor.sections.risk.labels.medium")}</p>
              </Card>
              <Card className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span className="text-sm font-semibold">401-650</span>
                </div>
                <p className="text-xs text-muted-foreground">{t("helpDialog.investor.sections.risk.labels.high")}</p>
              </Card>
              <Card className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-negative" />
                  <span className="text-sm font-semibold">0-400</span>
                </div>
                <p className="text-xs text-muted-foreground">{t("helpDialog.investor.sections.risk.labels.veryHigh")}</p>
              </Card>
            </div>
            <Card className="p-3 bg-warning-light border-warning/20 mt-3">
              <p className="text-sm text-warning-foreground">
                {t("helpDialog.investor.sections.risk.warning")}
              </p>
            </Card>
          </div>
        ),
      },
      {
        id: "portfolio",
        icon: DollarSign,
        title: t("helpDialog.investor.sections.portfolio.title"),
        content: (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{t("helpDialog.investor.sections.portfolio.description")}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {(t("helpDialog.investor.sections.portfolio.items", { returnObjects: true }) as Array<{ title: string; description: string }>).map((item) => (
                <li className="flex items-start gap-2" key={item.title}>
                  <CheckCircle className="h-4 w-4 text-positive-foreground mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>{item.title}</strong> {item.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ),
      },
      {
        id: "advance",
        icon: ArrowLeftRight,
        title: t("helpDialog.investor.sections.advance.title"),
        content: (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{t("helpDialog.investor.sections.advance.description")}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {(t("helpDialog.investor.sections.advance.items", { returnObjects: true }) as string[]).map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-positive-foreground mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ),
      },
      {
        id: "tips",
        icon: FileText,
        title: t("helpDialog.investor.sections.tips.title"),
        content: (
          <div className="space-y-2">
            {(t("helpDialog.investor.sections.tips.items", { returnObjects: true }) as Array<{ text: string; variant: "positive" | "info" }>).map((item) => (
              <Card
                key={item.text}
                className={`p-3 border-l-4 ${item.variant === "info" ? "border-l-info" : "border-l-positive"}`}
              >
                <p className="text-sm font-medium">{item.text}</p>
              </Card>
            ))}
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
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${isBorrower ? "bg-borrower" : "bg-investor"
                }`}
            >
              <HelpCircle
                className={`h-5 w-5 ${isBorrower ? "text-borrower-foreground" : "text-investor-foreground"}`}
              />
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
                  <section.icon
                    className={`h-4 w-4 ${isBorrower ? "text-borrower-foreground" : "text-investor-foreground"}`}
                  />
                  <span>{section.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">{section.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Card
          className={`p-4 mt-4 ${isBorrower ? "bg-borrower-ligth border-borrower/20" : "bg-investor-light border-investor/20"
            }`}
        >
          <div className="flex items-start gap-3">
            <User className={`h-5 w-5 mt-0.5 ${isBorrower ? "text-borrower" : "text-investor"}`} />
            <div>
              <h4 className="font-semibold mb-1">{t("helpDialog.shared.moreHelp.title")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("helpDialog.shared.moreHelp.description")}
              </p>
            </div>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
