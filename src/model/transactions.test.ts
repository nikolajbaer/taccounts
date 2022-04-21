import { expect, test } from 'vitest'
import { Transaction } from "./transaction";
import { Ledger } from './ledger';

test('transaction auto-creates date', () => {
  const t = new Transaction()
            .debit('Cash',10)
            .credit('Revenue',10)
            .debit('COGS',5)
            .credit('Inventory',5)
            .add_comment('Test Transaction')
  expect(t.date).not.toBe(null)
  expect(t.comment).toBe('Test Transaction')
})

test('transaction raises exception when not validated', () => {
  const t = new Transaction()
            .debit('Cash',10)
            .credit('Revenue',10)
            .debit('COGS',5)
  expect(() => t.validate()).toThrowError("Credits and Debits do not match")
  t.credit('Inventory',5)
  expect(t.validate()).toBe(t)
})

test('Ledger provides account balances', () => {
  const ledger = new Ledger()
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

  expect(ledger.balance("Cash")).toBe(7)
  expect(ledger.balance("COGS")).toBe(5)
  // Test sub account matching
  expect(ledger.balance("Inventory")).toBe(15)

})