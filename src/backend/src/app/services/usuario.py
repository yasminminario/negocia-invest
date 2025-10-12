"""Serviços relacionados à entidade ``usuarios``."""

from decimal import Decimal
from typing import List, Optional

from sqlalchemy.orm import Session

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