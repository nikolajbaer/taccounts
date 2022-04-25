import { useState,useEffect,useRef } from "react"
import { TAccount } from "./ui/taccount"
import { Transaction } from "./model/transaction"
import { Ledger } from "./model/ledger"
import { TransactionLog } from "./ui/transactionlog"
import { TransactionDetail } from "./ui/transactiondetail"
import { useEventListener } from "./util/helpers"
import { NewTransactionModal } from "./ui/newtransaction"

const test_ledger = new Ledger()
  .asset("Inventory")
  .asset("Cash",5)
  .asset("AR",0,"Accounts Receivable")
  .asset("PPE",100,"Property, Plants & Equipment")
  .liability("Sales Tax Payable")
  .equity("SE",0,"Stockholder's Equity")
  .equity("COGS",0,"Cost of Goods Sold",false)
  .equity("Revenue")
  .txn(
    new Transaction()
          .debit('Inventory',10)
          .debit('Inventory',10)
          .debit('Cash',2)
          .credit('SE',22,"New Investor")
          .add_comment('Initial investment')
          .validate()
  ).txn(
    new Transaction()
          .debit('AR',5)
          .credit('Sales Tax Payable',1)
          .credit('Revenue',4)
          .debit('COGS',5)
          .credit('Inventory',5)
          .add_comment('Invoice #1')
          .validate()
  ).txn(
    new Transaction()
          .debit('Cash',5)
          .credit('AR',5)
          .add_comment("Invoice #1 Paid")
          .validate()
  )
//DEBUG
//window.ledger = test_ledger
//window.Transaction = Transaction

export function App() {
  const [selected,setSelected] = useState<number|null>(null)
  const [showNewTransaction,setShowNewTransaction]  = useState<boolean>(false)

  const handleKeyPress = (event: KeyboardEvent) => {
    /* only handle shortcuts if body is focused */
    if( document.activeElement == null || document.activeElement.tagName != "BODY"){ return }
    if(event.key == " " ){
      setShowNewTransaction(true)
    }else if(event.key == "Escape" && showNewTransaction){
      setShowNewTransaction(false)
    }
  }

  const handleCloseNewTransaction = (transaction:Transaction|null) => {
    if(transaction != null){
      test_ledger.txn(transaction)
    }
    setShowNewTransaction(false)
  }

  useEventListener('keydown', handleKeyPress, document)

  useEffect( () => {
    if(selected == null){
      setSelected(test_ledger.latest_index())
    }
  })

  return (
    <>
      <nav>
        <h1>T-Accounts</h1>
      </nav>
      <section className="accounts">
        {test_ledger.active_accounts().map( account_def => {
          return (<TAccount
            key={account_def.account}
            account_def={account_def}
            lines={test_ledger.txn_for(account_def.account,selected)}
            balance={test_ledger.balance(account_def.account,selected)}
            selected={selected}
          ></TAccount>)
        })}
      </section>
      {(selected==null||selected==0)?"":(
        <section className="transaction_detail">
          <TransactionDetail 
            transaction={test_ledger.get(selected)}
          ></TransactionDetail>
        </section>
      )}
      <section className="transactions">
        <TransactionLog
          ledger={test_ledger}
          selected={selected}
          txnSelected={(txn) => setSelected(txn)}
        ></TransactionLog>
      </section>
      {showNewTransaction?(
        <div className="modal">
          <div className="modal-content">
            <button tabIndex={-1} onClick={() => setShowNewTransaction(false)} className="close">X</button>
            <NewTransactionModal
              handleClose={handleCloseNewTransaction}
              accounts={test_ledger.accounts().map(a=>a.account)}
            ></NewTransactionModal>
          </div>
        </div>
      ):''}
    </>
  )
}
