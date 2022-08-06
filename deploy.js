require("dotenv").config();
const fs = require("fs");
const ethers = require("ethers");

const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const main = async () => {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const ABI = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const BIN = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8");

  // contract facotry is an object used to deploy contracts
  const contractFactory = new ethers.ContractFactory(ABI, BIN, wallet);

  const contract = await contractFactory.deploy();
  await contract.deployTransaction.wait(1);

  console.log({ address: contract.address });

  // wait 1 block to make sure it gets attached to the chain
  // transaction receipt is only available when you wait for block confirmation
  const transactionReceipt = await contract.deployTransaction.wait(1);

  let favouriteNum = await contract.retrieve();

  favouriteNum = favouriteNum.toString();

  const tranxResponse = await contract.store("7");
  await tranxResponse.wait(1);
  let updatedFavNum = (await contract.retrieve()).toString();
  console.log({ updatedFavNum });
};

main()
  .then(() => process.exit(0))
  .catch((e) => {});
