import { expect, test } from 'vitest'
import { Transaction } from "../model/transaction";
import { Ledger } from '../model/ledger';
import { create_test_ledger } from './utils'

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
  expect(() => t.validate()).toThrowError("Debits must equal credits")
  t.credit('Inventory',5)
  expect(t.validate()).toBe(t)
})

test('Ledger provides account balances', () => {
  const ledger = create_test_ledger()
  expect(ledger.balance("Cash")).toBe(7)
  expect(ledger.balance("COGS")).toBe(5)
  // Test sub account matching
  expect(ledger.balance("Inventory")).toBe(15)

})

test("Ledger can serialize/deserialize", () => {
  const ledger = create_test_ledger()
  const output = JSON.stringify(ledger)
  const obj = JSON.parse(output)
  expect(obj.transactions.length).toBe(ledger.transactions.length)

  const new_ledger = new Ledger()
  new_ledger.deserialize(obj)
  expect(new_ledger.transactions.length).toBe(ledger.transactions.length)
  expect(new_ledger.balance("Inventory")).toBe(ledger.balance("Inventory"))
})

