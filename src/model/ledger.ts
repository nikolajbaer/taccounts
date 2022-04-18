import { Transaction, TransactionValidationError } from "./transaction"

export enum AccountType {
  Asset = "A",
  Liability = "L",
  Equity = "E",
  ContraAsset = "CA",
  ContraLiability = "CL",
}

export interface AccountDef {
  account: string
  type: AccountType
  beginning_balance: number
}

export class Ledger {
  transactions: Transaction[]
  account_def: AccountDef[] 

  constructor(transactions:Transaction[] = []){
    this.transactions = transactions
    this.account_def = []
  }

  define(account_name: string,account_type: AccountType,beginning_balance:number = 0){
    this.account_def.push({account:account_name,type:account_type,beginning_balance:beginning_balance})
    return this
  }
  // Convenience functions for readable API
  asset(account_name: string,beginning_balance:number = 0){ return this.define(account_name,AccountType.Asset) }
  liability(account_name: string,beginning_balance:number = 0){ return this.define(account_name,AccountType.Liability) }
  equity(account_name: string,beginning_balance:number = 0){ return this.define(account_name,AccountType.Equity) }
  contra_asset(account_name: string,beginning_balance:number = 0){ return this.define(account_name,AccountType.ContraAsset) }
  contra_liability(account_name: string,beginning_balance:number = 0){ return this.define(account_name,AccountType.ContraLiability) }

  txn(transaction){
    transaction.validate()
    transaction.accounts().map( account => {
      if(this.get_account_def(account) == null){
        throw new TransactionValidationError("No such root account: " + account)
      }
    })
    this.transactions.push(transaction)
    return this
  }

  get_account_def(account: string){
    for(var i=0; i<this.account_def.length; i++){
      if( account.startsWith(this.account_def[i].account)){
        return this.account_def[i] 
        // CONSIDER do we add sub accounts here?
        // or just compute on the fly?
      }
    }
    return null
  }

  balance(account:string,beginning_balance: number = 0){
    return this.transactions.reduce( (a,txn) => {
      const vals = txn.total_for(account)
      a += vals.debit - vals.credit
      return a
    },beginning_balance)
  }

  lines_for(account:string){
    return this.transactions.reduce( (lines,txn) => {
      return lines.concat(txn.for(account))
    },[])
  }

  active_accounts(){
    const txn_accounts = Object.keys(
      this.transactions.reduce( (accounts,txn) => {
        txn.lines.forEach( l => { 
          if(!accounts[l.account]){ accounts[l.account] = 1}
          else{ accounts[l.account] += 1 }
        })
        return accounts
      },{})
    )

    return this.accounts().filter( adef => {
      return txn_accounts.includes(adef.account)
    })
  }

  accounts(){
    return this.account_def
  }
}

