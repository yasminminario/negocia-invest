// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Emprestimo - contrato para registrar on-chain o contrato_tx_hash de um empréstimo
contract Emprestimo {
    address public registrador;
    bytes32 public contrato_tx_hash;
    string public contractData;

    event EmprestimoRegistrado(bytes32 indexed hash, address indexed registrador, string data);

    constructor() {
        registrador = msg.sender;
        contractData = "emprestimo_contract_data";
    }

    /// @notice registra o hash do contrato e um campo data de demonstração
    function registrar(bytes32 _hash, string memory _data) public {
        registrador = msg.sender;
        contrato_tx_hash = _hash;
        contractData = _data;
        emit EmprestimoRegistrado(_hash, msg.sender, _data);
    }

    function consultarHash() public view returns (bytes32) {
        return contrato_tx_hash;
    }
}
