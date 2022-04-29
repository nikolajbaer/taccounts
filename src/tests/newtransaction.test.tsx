import { expect, test, vi } from 'vitest'
import { NewTransactionModal } from '../ui/newtransaction'
import { render, fireEvent, waitFor, screen, getByLabelText } from '@testing-library/react'
import { Transaction } from '../model/transaction'

vi.mock('../ui/transactionline', () => {
  return {
    TransactionLineInput: (props: { onAdd: (account: string, debit: number|null, credit: number|null, note: string) => void }) => {
      return (<>
        <button onClick={() => props.onAdd('test', 1, null, '')}>test-debit</button>
        <button onClick={() => props.onAdd('test', null, 1, '')}>test-credit</button>
      </>)
    }
  }
})

test('new transaction', async () => {
  const accounts = ["Inventory", "Cash"]

  let txn = null
  const handleClose = (transaction: Transaction | null): void => {
    txn = transaction
  }

  const { container } = render(
    <NewTransactionModal
      accounts={accounts}
      handleClose={handleClose}
    />
  )

  const submit: HTMLButtonElement = screen.getByRole('button', { name: 'Submit' })
  expect(submit.disabled).toBe(true)

  await fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  expect(txn).toBe(null)

  await fireEvent.click(screen.getByRole('button', { name: 'test-debit' }))
  expect(screen.getByText('$1.00',{ignore:'.credit'})).not.toBeNull()
  expect(submit.disabled).toBe(true)

  await fireEvent.click(screen.getByRole('button', { name: 'test-credit' }))
  expect(screen.getByText('$1.00',{ignore:'.debit'})).not.toBeNull()
  expect(submit.disabled).toBe(false)
 
  // remove the first line
  await fireEvent.click(screen.getAllByRole('button',{name: 'X' })[0])
  expect(screen.getAllByText('$1.00').length).toBe(1)
  expect(submit.disabled).toBe(true)

  // add debit back in and we should be ready to submit
  await fireEvent.click(screen.getByRole('button', { name: 'test-debit' }))
  expect(submit.disabled).toBe(false)

  // now create the transaction
  await fireEvent.click(submit)
  expect(txn).not.toBeNull()

})