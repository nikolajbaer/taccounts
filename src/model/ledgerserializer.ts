import * as XLSX from 'xlsx'
import { AccountDef, Ledger } from './ledger';
import { Transaction } from './transaction';

export class LedgerSerializer {
  dump(ledger:Ledger): XLSX.WorkBook {
    const wb = XLSX.utils.book_new()
    wb.SheetNames.push(ledger.name) // Period Name? Ledger Name?
    const data = this.dump_accounts(ledger.account_def).concat(this.dump_transactions(ledger.transactions))
    XLSX.utils.aoa_to_sheet(data) 
    return wb
  }

  dump_transactions(transactions: Transaction[]): [[]] {
    return [[]]
  }

  load_transactions(xlsx:XLSX.WorkSheet): Transaction[] {
    return []
  }

  dump_accounts(accounts: AccountDef[]): [[]] {
    return [[]]
  }

  load_account(xlsx:XLSX.WorkSheet): AccountDef[] {
    return []
  }

  load(data: string): Ledger{
    const ledger = new Ledger()
    return ledger
  }

  dump_csv(ledger: Ledger): string {
    const wb = this.dump(ledger) 
    return XLSX.write(wb,{bookType:'csv',type:'string'})
  }
}