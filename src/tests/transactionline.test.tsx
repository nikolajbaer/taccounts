import { expect, test } from 'vitest'
import { TransactionLineInput } from '../ui/transactionline'
import { render, fireEvent, waitFor, screen, getByLabelText} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('transaction line', async () => {
  let added: any  = null
  const handleAdd = (account:string,debit:number|null,credit:number|null,note:string):void => {
    added = {account:account,debit:debit,credit:credit,note:note}
  }

  const accounts = ["Inventory","Cash"]

  const { container } = render(
    <TransactionLineInput 
      accounts={accounts}
      onAdd={handleAdd}
    />
  )
  const account: HTMLSelectElement = screen.getByTitle('Account')
  const debit: HTMLInputElement = screen.getByTitle('Debit')
  const credit: HTMLInputElement = screen.getByTitle('Credit')
  const note: HTMLInputElement = screen.getByTitle('Note')
  const add: HTMLButtonElement = screen.getByRole('button')

  // Select account
  expect(account.value).toBe('')
  await userEvent.selectOptions(account,'Cash')
  expect(account.value).toBe('Cash')

  // Try add before we fill in values, should be no handler
  await fireEvent.click(add)
  expect(added).toBeNull()

  // Change Credit/Debit nulls out other
  await fireEvent.change(debit,{target:{value:'10.0'}})
  expect(debit.value).toBe("10.0")
  expect(credit.value).toBe("")
  await fireEvent.change(credit,{target:{value:'10.0'}})
  expect(debit.value).toBe("")
  expect(credit.value).toBe("10.0")

  // Click Add
  await fireEvent.click(add)
  expect(added).not.toBeNull()
  expect(added.credit).toBe(10)
  expect(added.debit).toBe(null)
  expect(account.value).toBe('')

  // TODO figure out why this is not working
  //expect(account).toHaveFocus()
})
