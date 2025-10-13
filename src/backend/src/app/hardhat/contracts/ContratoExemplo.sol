// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RegistroContrato {
    address public registrador;
    bytes32 public contrato_hash_bytes;
    // Simple on-contract metadata that will appear in the ABI as a public getter
    string public contractData;

    // include a non-indexed `data` field so event.data is populated
    event ContratoRegistrado(bytes32 indexed _hash, address indexed _registrador, string _data);

    /// @notice constructor sets the deployer as the initial registrador
    constructor() {
        registrador = msg.sender;
        // initialize a small piece of data so compile output shows it in the ABI
        contractData = "hash_dados_contrato_tomador_investidor";
    }

    function registrar(bytes32 _contrato_hash_bytes, string memory _data) public {
        registrador = msg.sender;
        contrato_hash_bytes = _contrato_hash_bytes;
        // also persist the data on-chain for easy proof
        contractData = _data;
        emit ContratoRegistrado(_contrato_hash_bytes, msg.sender, _data);
    }

    function consultarHash() public view returns (bytes32) {
        return contrato_hash_bytes;
    }
}