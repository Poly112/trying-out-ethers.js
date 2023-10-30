const { ethers, JsonRpcProvider } = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

async function main() {
    const encryptedJson = fs.readFileSync(
        "./.sepolia.encryptedKey.json",
        "utf-8"
    )

    const provider = new JsonRpcProvider(process.env.RPC_URL)
    let wallet = await ethers.Wallet.fromEncryptedJson(
        encryptedJson,
        process.env.PRIVATE_KEY_PASSWORD
    )
    wallet = wallet.connect(provider)
    const abi = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.abi",
        "utf-8"
    )
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf-8"
    )
    // Two ways of deploying contract
    // 1.
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying, please wait...")

    const contract = await contractFactory.deploy({
        gasLimit: 3000000,
    })
    await contract.deploymentTransaction().wait(1)
    console.log(`Contract address: ${await contract.getAddress()}`)

    console.log("retrieving....")
    const currentFavoriteNumber = await contract.retrieve()
    console.log(`Current favourite number: ${currentFavoriteNumber.toString()}`)
    const transactResponse = await contract.store("10")
    const transactionReceipt = await transactResponse.wait(1)
    const updatedFavoriteNumber = await contract.retrieve()
    console.log(
        `Updated favourite number is : ${updatedFavoriteNumber.toString()}`
    )
}

main()
    .then(() => {
        process.exit(0)
    })
    .catch((err) => {
        console.log(err)
        process.exit(1)
    })
