import { ECPair, networks } from "bitcoinjs-lib";
import { tronWeb } from "./configTronweb";
const network = networks.bitcoin

const generateNewAddress = (): { address: string, privateKey: string } => {
    const keyPair = ECPair.makeRandom({ network })

    const privateKey = keyPair.privateKey!.toString('hex')
    const address = tronWeb.address.fromPrivateKey(privateKey)
    if (!address || !privateKey) {
        const error = new Error(`wallet generator error`)
        throw error
    }
    return { address, privateKey }
}

export { generateNewAddress }