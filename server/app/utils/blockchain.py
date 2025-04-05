import json
from pathlib import Path
from web3 import Web3
from config import Config

class BlockchainService:
    _instance = None
    
    def __init__(self):
        self.w3 = Web3(Web3.HTTPProvider(Config.BLOCKCHAIN_PROVIDER))
        
        # Load ABI from the contract_abi.json file
        abi_path = Path(__file__).parent.parent / 'contract_abi.json'
        with open(abi_path) as f:
            self.abi = json.load(f)
            
        self.contract = self.w3.eth.contract(
            address=Config.CONTRACT_ADDRESS,
            abi=self.abi
        )

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def store_hash(self, content_hash, doc_type):
        """Store document hash in blockchain"""
        try:
            tx = self.contract.functions.storeDocument(
                content_hash,
                doc_type,
                int(datetime.now().timestamp())
            ).build_transaction({
                'from': Config.WALLET_ADDRESS,
                'nonce': self.w3.eth.get_transaction_count(Config.WALLET_ADDRESS),
            })
            
            signed_tx = self.w3.eth.account.sign_transaction(tx, Config.PRIVATE_KEY)
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            return {
                'status': 'success',
                'tx_hash': tx_hash.hex(),
                'block_number': receipt['blockNumber']
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }