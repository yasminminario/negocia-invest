import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/contexts/ProfileContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

const SelectProfile = () => {
  const { setActiveProfile } = useProfile();
  const navigate = useNavigate();

  const handleSelectBorrower = () => {
    setActiveProfile('borrower');
    navigate('/borrower/dashboard');
  };

  const handleSelectInvestor = () => {
    setActiveProfile('investor');
    navigate('/investor/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Escolha seu perfil</h1>
          <p className="text-muted-foreground">Como você quer acessar a plataforma hoje?</p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Tomador */}
          <button
            onClick={handleSelectBorrower}
            className="p-8 rounded-2xl border-2 border-borrower bg-gradient-to-br from-borrower/10 to-borrower/20 hover:border-borrower hover:shadow-lg hover:shadow-borrower/20 transition-all text-left group"
          >
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-borrower/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingDown className="w-8 h-8 text-borrower" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-borrower mb-2">Tomador</h2>
                <p className="text-sm text-foreground/80">
                  Solicite empréstimos com taxas justas e negocie diretamente com investidores
                </p>
              </div>
              <div className="pt-4">
                <div className="inline-flex items-center gap-2 text-borrower font-medium">
                  <span>Acessar como Tomador</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </button>

          {/* Investidor */}
          <button
            onClick={handleSelectInvestor}
            className="p-8 rounded-2xl border-2 border-investor bg-gradient-to-br from-investor/10 to-investor/20 hover:border-investor hover:shadow-lg hover:shadow-investor/20 transition-all text-left group"
          >
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-investor/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-investor" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-investor mb-2">Investidor</h2>
                <p className="text-sm text-foreground/80">
                  Oferte crédito com retornos atrativos e negocie as melhores condições
                </p>
              </div>
              <div className="pt-4">
                <div className="inline-flex items-center gap-2 text-investor font-medium">
                  <span>Acessar como Investidor</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectProfile;
