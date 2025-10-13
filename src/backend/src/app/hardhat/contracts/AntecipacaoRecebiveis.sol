// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title AntecipacaoRecebiveis - registra contratos de antecipação de recebíveis on-chain
contract AntecipacaoRecebiveis {
    address public registrador;
    bytes32 public contrato_antecipacao_onchain;
    string public contractData;

    event AntecipacaoRegistrada(bytes32 indexed hash, address indexed registrador, string data);

    constructor() {
        registrador = msg.sender;
        contractData = "antecipacao_contract_data";
    }

    /// @notice registra o hash de antecipação e um campo data de demonstração
    function registrarAntecipacao(bytes32 _hash, string memory _data) public {
        registrador = msg.sender;
        contrato_antecipacao_onchain = _hash;
        contractData = _data;
        emit AntecipacaoRegistrada(_hash, msg.sender, _data);
    }

    function consultarHashAntecipacao() public view returns (bytes32) {
        return contrato_antecipacao_onchain;
    }
}