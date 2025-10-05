// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RegistroContrato {
    // Endereço do Tomador/Investidor que registrou o contrato
    address public registrador;
    // A hash SHA-256 do contrato de empréstimo (gerada off-chain)
    bytes32 public contrato_hash_bytes;

    // Evento para rastrear o registro
    event ContratoRegistrado(bytes32 indexed _hash, address indexed _registrador);

    function registrar(bytes32 _contrato_hash_bytes) public {
        registrador = msg.sender;
        hashContrato = _contrato_hash_bytes;
        emit ContratoRegistrado(_contrato_hash_bytes, msg.sender);
    }

    // Função de leitura (gratuita) para verificar a hash
    function consultarHash() public view returns (bytes32) {
        return hashContrato;
    }
}