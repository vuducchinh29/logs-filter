const {ethers, Wallet} = require('ethers')
const ROFI_ABI = require('./rofi.json')
const LIST = require('./list-test.json')
const provider_url = 'https://bsc-dataseed1.defibit.io/'
const provider = new ethers.providers.JsonRpcProvider(provider_url)

const interface = new ethers.utils.Interface(ROFI_ABI)

const withdraw_contract = '0xBb6a8792091bFC24Cd08E7C9a1ef4f517A90bC22' //example

const is_lock_rofi_tx = async (txHash) => {
    const tx = await provider.getTransaction(txHash)
    if (tx.to !== withdraw_contract) return console.log('Incorrect contract')
    const receipt = await provider.getTransactionReceipt(txHash)
    const logs = receipt.logs
    const rofi_transfer_log = logs[0]
    const parsedLog = interface.parseLog(rofi_transfer_log)
    const to_address = parsedLog.args.to
    if (to_address === '0x5DcD63B5562C932a550d384bF54656E9f6C36b2b') {
        return console.log(txHash, '- unlock')
    } else {
        return console.log(txHash, '- lock')
    }
}

const main = async () => {
    for (let txHash of LIST) {
        await is_lock_rofi_tx(txHash)
    }
}

main()
