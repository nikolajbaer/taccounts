import { Ledger } from "../model/ledger"
import { Transaction } from "../model/transaction"

export function create_test_ledger(name?:string): Ledger {
  const test_ledger = new Ledger(name)
      .asset("Cash")
      .asset("Inventory")
      .asset("AR")
      .equity("SE",0,null,true)
      .equity("COGS",0,null,false)
      .equity("Revenue",0,null,true)
      .txn(
        new Transaction()
              .debit('Inventory/Widgets',10)
              .debit('Inventory/DooDads',10)
              .debit('Cash',2)
              .credit('SE',22)
              .add_comment('Initial investment')
              .validate()
      ).txn(
        new Transaction()
              .debit('AR',5)
              .credit('Revenue',5)
              .debit('COGS',5)
              .credit('Inventory/Widgets',5)
              .add_comment('Invoice #1')
              .validate()
      ).txn(
        new Transaction()
              .debit('Cash',5)
              .credit('AR',5)
              .add_comment("Invoice #1 Paid")
              .validate()
      )
  return test_ledger
}