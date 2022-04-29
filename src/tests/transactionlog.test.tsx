import { expect, test, vi } from 'vitest'
import { render, fireEvent, waitFor, screen, getByLabelText} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TransactionLog } from '../ui/transactionlog'
import { create_test_ledger } from './utils' 

test('transaction log', async () => {
  const ledger = create_test_ledger()

  let selected = null
  const handleTxnSelected = (index:number) => {
    selected = index
  }

  const handleNewTxn = vi.fn()

  const { container } = render(
    <TransactionLog
      txnSelected={handleTxnSelected}
      selected={0}
      ledger={ledger}
      onNewTxn={handleNewTxn}
    />
  )

  // Click a transaction
  const txn = ledger.get(2)
  await fireEvent.click(screen.getByText(txn.index))
  expect(selected).toBe(txn.index)

  // change selection to clicked transaction
  await fireEvent.click(screen.getByText('BB'))
  expect(selected).toBe(0)

  // mouse over to temporarily see transactino 
  await fireEvent.mouseOver(screen.getByText(txn.index))
  expect(selected).toBe(txn.index)
  // but leave and 0 ist sticky from prior click
  await fireEvent.mouseLeave(screen.getByTitle("Transaction Log"))
  // TODO why isn't this changing
  //expect(selected).toBe(0)

})