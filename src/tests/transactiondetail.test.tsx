import { expect, test } from 'vitest'
import { TransactionDetail } from '../ui/transactiondetail'
import { render, fireEvent, waitFor, screen, getByLabelText} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Transaction } from '../model/transaction'

test('transaction detail', async () => {
  const txn = new Transaction('test123')
                  .debit("Inventory",10)
                  .credit("Cash",10,"test note")
                  .add_comment("Test Comment")

  render(
    <TransactionDetail
      transaction={txn}
    />
  )

  expect(screen.getAllByText("$10").length).toBe(2)
  expect(screen.getAllByText("Inventory").length).toBe(1)
  expect(screen.getAllByText("Cash").length).toBe(1)
  expect(screen.getByText(/test123/))

})