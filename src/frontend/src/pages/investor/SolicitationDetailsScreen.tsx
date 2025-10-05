import { useNavigate, useParams } from 'react-router-dom';

const InvestorSolicitationDetailsScreen = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    return (
        <div className="min-h-[400px] w-full px-4 pt-6">
            <h1 className="text-lg font-semibold text-black mb-4">Detalhes da Solicitação</h1>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm text-slate-600">Solicitação ID: {id}</p>
                <p className="text-sm text-slate-600">Tomador: Carlos Silva</p>
                <p className="text-sm text-slate-600">Valor solicitado: R$ 10.000,00</p>
                <div className="mt-4">
                    <button
                        onClick={() => navigate(`/app/investidor/negociar/${id}`)}
                        className="rounded-full bg-[var(--primary-color,#9B59B6)] px-6 py-3 text-sm font-semibold text-white"
                    >
                        Iniciar Negociação
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvestorSolicitationDetailsScreen;
