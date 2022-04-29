import { useState,useEffect } from "react"
import { TAccount } from "./taccount"
import { Ledger, AccountDef } from "../model/ledger"
import { Transaction } from "../model/transaction"
import { TransactionLog } from "./transactionlog"
import { TransactionDetail } from "./transactiondetail"
import { useEventListener } from "../util/helpers"
import { NewTransactionModal } from "./newtransaction"
import { NewAccount } from "./newaccount"

export function LedgerView( props: { ledger: Ledger, onLedgerChange?: () => void } ) {
  const [accounts,setAccounts] = useState<AccountDef[]>(props.ledger.accounts())
  const [selected,setSelected] = useState<number|null>(null)
  const [showNewTransaction,setShowNewTransaction]  = useState<boolean>(false)
  const [showNewAccount,setShowNewAccount]  = useState<boolean>(false)
  const [showRollback,setShowRollback] = useState<boolean>(false)

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
      props.ledger.txn(transaction)
      if(props.onLedgerChange){ props.onLedgerChange() }
    }
    setShowNewTransaction(false)
    setSelected(props.ledger.latest_index())
  }

  const handleNewAccount = (account:AccountDef|null) => {
    if(account != null){
      console.log("Adding account",account)
      props.ledger.define_adef(account)
      setAccounts([...props.ledger.accounts()])
      if(props.onLedgerChange){ props.onLedgerChange() }
    }
    setShowNewAccount(false)
  }

  useEventListener('keydown', handleKeyPress, document)

  useEffect( () => {
    setAccounts([...props.ledger.accounts()])
    setSelected(props.ledger.latest_index())
  },[props.ledger])

  const selectedTransaction  = selected?props.ledger.get(selected):props.ledger.get(props.ledger.latest_index())

  return (<>
      <section className="accounts">
        <h2>{props.ledger.name}</h2>
        {accounts.map( account_def => {
          return (<TAccount
            key={account_def.account}
            account_def={account_def}
            lines={props.ledger.txn_for(account_def.account,selected)}
            balance={props.ledger.balance(account_def.account,selected)}
            selected={selected}
          ></TAccount>)
        })}
        <div className="new_account">
          <button onClick={() => setShowNewAccount(true)}>+</button>
        </div>
      </section>
      {selectedTransaction?(
        <section className="transaction_detail">
          <TransactionDetail 
            transaction={selectedTransaction}
          ></TransactionDetail>
        </section>
      ):""}
      <section className="transactions">
        <TransactionLog
          ledger={props.ledger}
          selected={selected}
          txnSelected={(txn) => setSelected(txn)}
          onNewTxn={() => setShowNewTransaction(true)}
          onRollback={() => setShowRollback(true)}
        ></TransactionLog>
      </section>
      {showNewTransaction?(
        <div className="modal">
          <div className="modal-content">
            <button tabIndex={-1} onClick={() => setShowNewTransaction(false)} className="close">✕</button>
            <NewTransactionModal
              handleClose={handleCloseNewTransaction}
              accounts={props.ledger.accounts().map(a=>a.account)}
            ></NewTransactionModal>
          </div>
        </div>
      ):''}
      {showNewAccount?(
        <div className="modal">
          <div className="modal-content">
            <button tabIndex={-1} onClick={() => setShowNewAccount(false)} className="close">✕</button>
            <NewAccount
              addNewAccount={handleNewAccount}
              accounts={props.ledger.accounts().map(a=>a.account)}
            ></NewAccount>
          </div>
        </div>
      ):""}
      {showRollback?(
        <div className="modal">
          <div className="modal-content">
            <button tabIndex={-1} onClick={() => setShowRollback(false)} className="close">✕</button>
            <h4>Rollback {selected}</h4>
          </div>
        </div>
      ):""}
  </>)
}