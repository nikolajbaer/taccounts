import { Transaction, TransactionValidationError } from "./transaction"

export enum AccountType {
  Asset = "A",
  Liability = "L",
  Equity = "E",
}

export interface AccountDef {
  account: string
  name: string | null
  type: AccountType
  credit_normal: boolean,
  beginning_balance: number,
}

function sort_accounts(account_a:AccountDef,account_b:AccountDef){
  const M = {"A":0,"L":1,"E":2}
  return M[account_a.type] - M[account_b.type]
}

export class Ledger {
  transactions: Transaction[]
  account_def: AccountDef[] 

  constructor(transactions:Transaction[] = []){
    this.transactions = transactions
    this.account_def = []
  }

  define(
    account_name: string,
    account_type: AccountType,
    credit_normal: boolean,
    beginning_balance:number = 0,
    name: string | null = null
  ){
    this.account_def.push({
      account:account_name,
      type:account_type,
      credit_normal:credit_normal,
      beginning_balance:beginning_balance,
      name: name
    })
    return this
  }
  // Convenience functions for readable API
  asset(account_name: string,beginning_balance:number = 0,name: string|null = null,credit_normal:boolean=false){ 
    return this.define(account_name,AccountType.Asset,credit_normal,beginning_balance,name) 
  }
  liability(account_name: string,beginning_balance:number = 0,name: string|null = null,credit_normal:boolean=true){ 
    return this.define(account_name,AccountType.Liability,credit_normal,beginning_balance,name) 
  }
  equity(account_name: string,beginning_balance:number = 0,name: string|null = null,credit_normal:boolean=true){ 
    return this.define(account_name,AccountType.Equity,credit_normal,beginning_balance,name) 
  }

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

  balance(account:string){
    const adef = this.get_account_def(account)
    const bb = adef.beginning_balance?adef.beginning_balance:0
    return this.transactions.reduce( (a,txn) => {
      const vals = txn.total_for(account)
      a += (adef.credit_normal)?(vals.credit - vals.debit):(vals.debit - vals.credit)
      return a
    },bb)
  }

  lines_for(account:string){
    return this.transactions.reduce( (lines,txn) => {
      return lines.concat(txn.for(account))
    },[])
  }

  active_accounts(){
    const txn_accounts = Array.from(this.transactions.reduce( (accounts,txn) => {
      txn.lines.forEach( l => { 
        if(!accounts.has(l.account)){ 
          accounts.set(l.account,this.get_account_def(l.account))
        }
      })
      return accounts
    },new Map<String,AccountDef>()).values())

    return txn_accounts.sort(sort_accounts)
  }

  accounts(){
    return this.account_def.sort(sort_accounts)
  }
}

