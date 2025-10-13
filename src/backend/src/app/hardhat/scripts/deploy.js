async function main() {
  const RegistroContrato = await ethers.getContractFactory("RegistroContrato");
  const contrato = await RegistroContrato.deploy();
  await contrato.waitForDeployment();

  console.log("✅ Contrato deployado:", await contrato.getAddress());
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});