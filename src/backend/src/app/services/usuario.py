"""Serviços relacionados à entidade ``usuarios``."""

from decimal import Decimal
from typing import List, Optional
import secrets

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.usuario import Usuario, UsuarioResponse
import random
from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash


class UsuarioService:
    """Camada de acesso a dados dos usuários."""

    @staticmethod
    def login(db: Session, email: str, senha: str) -> UsuarioResponse:
        """Autentica usuário por email e senha. Retorna UsuarioResponse ou lança ValueError."""

        email = (email or "").strip().lower()
        senha = (senha or "")

        if not email or not senha:
            raise ValueError("Email e senha são obrigatórios.")
        usuario = db.query(Usuario).filter(func.lower(Usuario.email) == email).first()

        if not usuario or not check_password_hash(usuario.senha, senha):
            raise ValueError("Email ou senha inválidos.")

        return UsuarioService.to_response(usuario)

    @staticmethod
    def criar(
        db: Session,
        nome: str,
        email: str,
        senha: str,
        confirmar_senha: str,
        cpf: Optional[str] = None,
        endereco: Optional[str] = None,
        renda_mensal: float = 0,
        celular: Optional[str] = None,
        wallet_adress: Optional[str] = None,
        facial: float = 0,
    ) -> UsuarioResponse:
        """Cria um usuário aceitando campos opcionais adicionais.

        Campos opcionais: cpf, endereco, renda_mensal, celular, wallet_adress, facial
        """

        nome = (nome or "").strip()
        email = (email or "").strip().lower()
        senha = (senha or "")
        confirmar_senha = (confirmar_senha or "")

        if not nome or not email or not senha or not confirmar_senha:
            raise ValueError("Nome, email, senha e confirmação de senha são obrigatórios.")

        if senha != confirmar_senha:
            raise ValueError("Senha e confirmação de senha não coincidem.")

        if len(senha) < 6:
            raise ValueError("A senha deve ter pelo menos 6 caracteres.")

        if db.query(Usuario).filter(func.lower(Usuario.email) == email).first():
            raise ValueError("Email já cadastrado.")

        # Normaliza CPF (armazena só dígitos) se fornecido
        cpf_db = None
        if cpf is not None:
            somente_digitos = ''.join(filter(str.isdigit, cpf or ""))
            if somente_digitos == "":
                cpf_db = None
            else:
                if len(somente_digitos) != 11:
                    raise ValueError("CPF inválido. Deve conter 11 dígitos.")
                # Verifica unicidade de CPF
                existente_cpf = db.query(Usuario).filter(Usuario.cpf == somente_digitos).first()
                if existente_cpf:
                    raise ValueError("CPF já cadastrado.")
                cpf_db = somente_digitos

        # Normaliza celular
        celular_db = None
        if celular is not None:
            somente_digitos = ''.join(filter(str.isdigit, celular or ""))
            if somente_digitos == "":
                celular_db = None
            else:
                if len(somente_digitos) < 8:
                    raise ValueError("Celular inválido.")
                celular_db = somente_digitos

        # Wallet: gere se não fornecida
        if not wallet_adress:
            wallet_adress = "0x" + secrets.token_hex(20)

        saldo_inicial = float(round(random.uniform(1000.0, 60000.0), 2))
        usuario = Usuario(
            nome=nome,
            email=email,
            senha=generate_password_hash(senha),
            saldo_cc=saldo_inicial,
            cpf=cpf_db,
            endereco=endereco,
            renda_mensal=renda_mensal,
            celular=celular_db,
            wallet_adress=wallet_adress,
            facial=float(facial) if facial is not None else None,
        )

        db.add(usuario)
        db.flush()  # garante que id e timestamps sejam populados
        db.commit()
        db.refresh(usuario)
        return UsuarioService.to_response(usuario)

    @staticmethod
    def atualizar(db: Session, usuario_id: int,
                  nome: Optional[str] = None,
                  email: Optional[str] = None,
                  cpf: Optional[str] = None,
                  celular: Optional[str] = None) -> UsuarioResponse:
        """Atualiza campos opcionais do usuário (nome, email, cpf, celular)."""

        usuario = db.query(Usuario).filter(Usuario.id == usuario_id).with_for_update().first()
        if not usuario:
            raise ValueError(f"Usuário {usuario_id} não encontrado.")

        # Nome
        if nome is not None:
            nome = (nome or "").strip()
            if not nome:
                raise ValueError("Nome não pode ser vazio.")
            usuario.nome = nome

        # Email (verifica unicidade)
        if email is not None:
            email = (email or "").strip().lower()
            if not email:
                existente = db.query(Usuario).filter(func.lower(Usuario.email) == email, Usuario.id != usuario_id).first()
                existente = db.query(Usuario).filter(Usuario.email == email, Usuario.id != usuario_id).first()
            if existente:
                raise ValueError("Email já cadastrado.")
            usuario.email = email

        # CPF (aceita limpar com string vazia)
        if cpf is not None:
            somente_digitos = ''.join(filter(str.isdigit, cpf or ""))
            if somente_digitos == "":
                usuario.cpf = None
            else:
                if len(somente_digitos) != 11:
                    raise ValueError("CPF inválido. Deve conter 11 dígitos.")
                usuario.cpf = somente_digitos  # armazena somente dígitos

        # Celular (aceita limpar com string vazia)
        if celular is not None:
            somente_digitos = ''.join(filter(str.isdigit, celular or ""))
            if somente_digitos == "":
                usuario.celular = None
            else:
                if len(somente_digitos) < 8:
                    raise ValueError("Celular inválido.")
                usuario.celular = somente_digitos  # armazena somente dígitos

        db.flush()
        return UsuarioService.to_response(usuario)

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
            wallet_adress=usuario.wallet_adress,
            senha=usuario.senha,
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