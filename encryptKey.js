const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

async function main() {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY)
    const encryptedJsonKey = await ethers.encryptKeystoreJson(
        wallet,
        process.env.PRIVATE_KEY_PASSWORD
    )
    fs.writeFileSync("./.sepolia.encryptedKey.json", encryptedJsonKey)
}

main()
    .then(() => {
        process.exit(0)
    })
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
