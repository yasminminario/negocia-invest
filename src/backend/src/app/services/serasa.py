import requests
import random

def get_serasa_score(cpf: str) -> int:
    """
    Mock da chamada à API do Serasa. Substitua por integração real depois.
    Args:
        cpf (str): CPF do usuário
    Returns:
        int: Score do Serasa (0-1000)
    """
    # Exemplo de chamada real:
    # response = requests.post('https://api.serasa.com/score', json={'cpf': cpf}, headers={...})
    # score = response.json().get('score', 0)
    # return score
    # Mock para hackathon:
    return random.randint(300, 900)
