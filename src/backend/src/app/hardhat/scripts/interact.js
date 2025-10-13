const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying contracts with account:', deployer.address);

  const Registry = await hre.ethers.getContractFactory('RegistroContrato');
  const registry = await Registry.deploy();
  await registry.deployed();

  console.log('Contrato deployado em:', registry.address);

  // grava ABI + address localmente para o backend ler
  const artifactsPath = path.resolve(__dirname, '..', '..', 'ContratoExemplo_abi.json');
  try {
    const artifact = await hre.artifacts.readArtifact('RegistroContrato');
    const data = { abi: artifact.abi, address: registry.address };
    fs.writeFileSync(artifactsPath, JSON.stringify(data, null, 2));
    console.log('ABI escrita em', artifactsPath);
  } catch (err) {
    console.warn('Falha ao ler artifact via hre.artifacts, tentando fallback. Error:', err);
    const abi = Registry.interface.format(hre.ethers.FormatTypes.json);
    const data = { abi: JSON.parse(abi), address: registry.address };
    fs.writeFileSync(artifactsPath, JSON.stringify(data, null, 2));
    console.log('ABI escrita (fallback) em', artifactsPath);
  }

  // exemplo de registrar um hash (32 bytes) e ler o evento
  const sampleHash = hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes('exemplo-de-contrato'));
  const tx = await registry.registrar(sampleHash);
  const receipt = await tx.wait();
  console.log('Transação registrar enviada. Hash:', tx.hash);
  console.log('Eventos:', receipt.events ? receipt.events.map(e => ({event: e.event, args: e.args})) : []);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
