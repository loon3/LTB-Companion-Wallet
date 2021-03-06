# LTB Companion Wallet

[![Join the chat at https://gitter.im/loon3/LTB-Companion-Wallet](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/loon3/LTB-Companion-Wallet?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Chrome Extension Bitcoin/Counterparty Wallet for use with letstalkbitcoin.com

Donate BTC, XCP or your favorite asset to 1LrM4bojLAKfuoFMXkDtVPMGydX1rkaMqH

## Release Notes

v0.1.3 - Initial beta release

v0.1.4 - Added asset icons via counterpartychain.io 

v0.1.5 - Updated LTB Companion Wallet icon 

v0.1.6 - Added background images and logo in welcome splash  

v0.1.7 - Removed clipboardRead permission

v0.2.0 - Send to letstalkbitcoin.com usernames

v0.2.1 - Update to chain.so API in place of blockchain.info

v0.3.0 - Added Apps section, Shapeshift, What's New at LTB?, sign & copy function, btc balance api changed to Insight, passphrase field on initial login type change from masked to visible, XCP removed from asset inventory if balance is zero

v0.3.1 - Now using op_return for send txs, asset to token terminology change, LTBn Directory

v0.3.2 - Fixes XCP NaN bug, LTBn Directory updated

v0.4.0 - Tip Button for letstalkbitcoin.com

v0.4.1 - Add Tokenly.co permission for tip button

v0.4.2 - Replace Insight API with Blockr API, add tokenly.com content script permission, Add New Address, Address Labels

v0.4.3 - Revert to Insight API to enable multiple unconfirmed sends, Address Labels for Tip Button window

v0.4.4 - Address dropdown formatting, check BTC balance when adding new address

v0.4.5 - Minor formatting, BTC balance check during Asset loading

v0.4.6 - API change (Blockr for BTC balance, Insight for UTXOs)

v0.4.7 - Fixes Asset display bug in Tip splash

## Features

- Send Bitcoin and Counterparty assets
- Passphrase interoperability with Counterwallet
- Client-side passphrase encryption
- Message signing
- LTBCOIN price feed derived from Poloniex LTBCOIN/BTC rate and the Bitcoinaverage BTC/USD rate and updates every 15 minutes.

Please report all issues at https://github.com/loon3/LTB-Companion-Wallet/issues