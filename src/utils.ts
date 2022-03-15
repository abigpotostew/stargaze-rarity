import {
    encodeSecp256k1Pubkey,
    Secp256k1HdWallet,
    Bip39,
    Random,
  } from 'cosmwasm';

export const randomContract = async () => {
    const mnemonic = Bip39.encode(Random.getBytes(16)).toString();
    const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: 'stars',
    });
    const [{ address, pubkey }] = await wallet.getAccounts();
    return address;
}