"""
Este arquivo é responsável pelas lógicas relacionadas às propostas e contrapropostas de empréstimos, incluindo a criação, atualização e consulta de propostas no banco de dados.
"""

from sqlalchemy.orm import Session
from app.models.proposta import Proposta, PropostaCreate
from typing import Optional, List
from app.models.negociacao import Negociacao, NegociacaoCreate

class PropostaService:
    
    @staticmethod
    def criar_proposta(db: Session, proposta_data: PropostaCreate) -> Proposta:
        """Cria uma proposta no banco de dados e automaticamente cria uma negociação relacionada."""

        # Se não há id_negociacoes, cria uma nova negociação
        if not proposta_data.id_negociacoes:
            
            # Determina quem é tomador e quem é investidor
            if proposta_data.autor_tipo == "tomador":
                id_tomador = proposta_data.id_autor
                # Para desenvolvimento, usa um investidor padrão ou deixa o mesmo ID
                id_investidor = proposta_data.id_autor + 1  # Assumindo que o próximo ID é um investidor
            else:  # autor_tipo == "investidor"
                id_investidor = proposta_data.id_autor
                # Para desenvolvimento, usa um tomador padrão ou deixa o mesmo ID
                id_tomador = proposta_data.id_autor + 1  # Assumindo que o próximo ID é um tomador
            
            # Converte taxa de string para float (remove o % e divide por 100)
            taxa_numerica = float(proposta_data.taxa_sugerida.replace('%', '')) / 100
            
            # Cria dados da negociação
            negociacao_data = NegociacaoCreate(
                id_tomador=id_tomador,
                id_investidor=id_investidor,
                status="em_negociacao",
                taxa=taxa_numerica,
                quant_propostas=1  # Primeira proposta
            )
            
            # Cria a negociação
            db_negociacao = Negociacao(**negociacao_data.model_dump())
            db.add(db_negociacao)
            db.flush()  # Para obter o ID sem fazer commit ainda
            
            # Atualiza a proposta com o ID da negociação criada
            proposta_dict = proposta_data.model_dump()
            proposta_dict['id_negociacoes'] = db_negociacao.id
            
        else:
            # Se já existe uma negociação, apenas usa os dados da proposta
            proposta_dict = proposta_data.model_dump()
            
            # Atualiza o contador de propostas na negociação existente
            negociacao_existente = db.query(Negociacao).filter(
                Negociacao.id == proposta_data.id_negociacoes
            ).first()
            
            if negociacao_existente:
                negociacao_existente.quant_propostas += 1

        # Cria a proposta
        db_proposta = Proposta(**proposta_dict)
        db.add(db_proposta)
        
        # Commit de tudo junto
        db.commit()
        db.refresh(db_proposta)
        
        return db_proposta

    @staticmethod
    def get_propostas(db: Session, id_negociacoes: Optional[int] = None) -> List[Proposta]:
        """Retorna uma lista de propostas, podendo filtrar por id_negociacoes."""
        
        query = db.query(Proposta)
        
        if id_negociacoes:
            query = query.filter(Proposta.id_negociacoes == id_negociacoes)
            
        return query.order_by(Proposta.criado_em.desc()).all()