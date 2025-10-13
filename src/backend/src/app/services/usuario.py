"""Serviços relacionados à entidade ``usuarios``."""

from decimal import Decimal
from typing import List, Optional

from sqlalchemy.orm import Session
from eth_account import Account
from app.models.usuario import UsuarioCreate
from app.models.usuario import Usuario as UsuarioModel
from sqlalchemy.exc import IntegrityError

from app.models.usuario import Usuario, UsuarioResponse


class UsuarioService:
    """Camada de acesso a dados dos usuários."""

    @staticmethod
    def listar(db: Session) -> List[UsuarioResponse]:
        usuarios = db.query(Usuario).order_by(Usuario.nome.asc()).all()
        return [UsuarioService.to_response(usuario) for usuario in usuarios]

    @staticmethod
    def obter_por_id(db: Session, usuario_id: int) -> Optional[UsuarioResponse]:
        usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
        return UsuarioService.to_optional_response(usuario)

    # --- Métodos utilitários de sanitização ---

    @staticmethod
    def _mascarar_cpf(cpf: Optional[str]) -> Optional[str]:
        if not cpf:
            return None

        somente_digitos = ''.join(filter(str.isdigit, cpf))
        if len(somente_digitos) != 11:
            return "***.***.***-**"

        return f"***.{somente_digitos[3:6]}.***-{somente_digitos[-2:]}"

    @staticmethod
    def _mascarar_celular(celular: Optional[str]) -> Optional[str]:
        if not celular:
            return None

        somente_digitos = ''.join(filter(str.isdigit, celular))
        if len(somente_digitos) < 4:
            return "***"

        return f"(**) *****-{somente_digitos[-4:]}"

    @staticmethod
    def _iniciais(nome: str) -> str:
        partes = [parte for parte in nome.strip().split() if parte]
        if not partes:
            return "?"
        if len(partes) == 1:
            return partes[0][0].upper()
        return f"{partes[0][0]}{partes[-1][0]}".upper()

    @staticmethod
    def to_response(usuario: Usuario) -> UsuarioResponse:
        return UsuarioService.to_optional_response(usuario)

    @staticmethod
    def to_optional_response(usuario: Optional[Usuario]) -> Optional[UsuarioResponse]:
        if usuario is None:
            return None

        return UsuarioResponse(
            id=usuario.id,
            nome=usuario.nome,
            email=usuario.email,
            saldo_cc=float(usuario.saldo_cc or 0),
            wallet_adress=usuario.wallet_adress,
            cpf_mascarado=UsuarioService._mascarar_cpf(usuario.cpf),
            celular_mascarado=UsuarioService._mascarar_celular(usuario.celular),
            iniciais=UsuarioService._iniciais(usuario.nome),
            criado_em=usuario.criado_em,
        )

    @staticmethod
    def ajustar_saldo(db: Session, usuario_id: int, delta: float) -> Usuario:
        """Aplica uma variação de saldo (positiva ou negativa) ao usuário."""

        usuario = db.query(Usuario).filter(Usuario.id == usuario_id).with_for_update().first()
        if not usuario:
            raise ValueError(f"Usuário {usuario_id} não encontrado para ajuste de saldo.")

        saldo_atual = Decimal(str(usuario.saldo_cc or 0))
        ajuste = Decimal(str(delta))
        novo_saldo = saldo_atual + ajuste

        if novo_saldo < Decimal("0"):
            raise ValueError(f"Usuário {usuario_id} não possui saldo suficiente para a operação.")

        usuario.saldo_cc = float(novo_saldo)
        return usuario

    @staticmethod
    def transferir_valor(db: Session, investidor_id: int, tomador_id: int, valor: float) -> None:
        """Transfere valor do investidor para o tomador (valor > 0)."""

        if valor is None or valor <= 0:
            return

        UsuarioService.ajustar_saldo(db, investidor_id, -valor)
        UsuarioService.ajustar_saldo(db, tomador_id, valor)

    @staticmethod
    def criar_usuario(db: Session, usuario_data: UsuarioCreate) -> UsuarioResponse:
        """Cria um novo usuário, gera uma carteira Ethereum e salva apenas o endereço na tabela.

        Observação: por segurança não armazenamos a chave privada aqui. Se for necessário guardar a chave,
        ela deve ser criptografada com uma chave de aplicação gerenciada com segurança (KMS) — não implementado.
        """

        # Gera uma nova conta (chave privada não será persistida)
        account = Account.create()
        endereco = account.address

        usuario = UsuarioModel(
            nome=usuario_data.nome,
            email=usuario_data.email,
            cpf=usuario_data.cpf,
            endereco=usuario_data.endereco,
            renda_mensal=usuario_data.renda_mensal,
            celular=usuario_data.celular,
            facial=usuario_data.facial,
            saldo_cc=usuario_data.saldo_cc if getattr(usuario_data, 'saldo_cc', None) is not None else 0,
            wallet_adress=endereco,
        )

        db.add(usuario)
        try:
            db.commit()
            db.refresh(usuario)
        except IntegrityError as e:
            db.rollback()
            # Reraise a ValueError com mensagem mais amigável
            raise ValueError("Não foi possível criar usuário: email/cpf/wallet já existe.") from e

        return UsuarioService.to_response(usuario)