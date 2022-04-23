import { useEffect, useState, useRef } from "react"
import { Transaction,TransactionValidationError, TxnLine } from "../model/transaction"
import { TransactionLineInput } from "./transactionline"
import { money } from "../util/helpers"

export function NewTransactionModal(props: { handleClose: (transaction:Transaction) => void }){
  const [transaction,updateTransaction] = useState<Transaction>(new Transaction())
  const [lines,setLines] = useState<TxnLine[]>([])
  const [txnref,setTxnRef] = useState<string>('')

  const handleClick = () => {
    try{
      if(txnref){
        transaction.ref = txnref
      }
      transaction.validate()
      console.log(transaction)
      props.handleClose(transaction)
    }catch(e){
      if( e instanceof TransactionValidationError){
        alert(e.message) 
      }
    }
  }

  const removeLine = (index:number) => {
  }

  const addLine = (account:string,debit:number|null,credit:number|null,note:string): void => {
    if(debit != null){
      transaction.debit(account,debit,note)
    }else if(credit != null){
      transaction.credit(account,credit,note)
    }
    setLines([...transaction.lines])
  }

  return (<div className="txn_add">
    <h4>Add Transaction</h4>
    <div>
      <div>
        <input type="text" placeholder="Transaction Reference# (blank for auto-id)" value={txnref} onChange={(e) => setTxnRef(e.target.value)} />
      </div>
      <div className="lines">
        <div className="line header">
          <div>Account</div>
          <div>Debit</div>
          <div>Credit</div>
          <div>Notes</div>
        </div>
        {lines.map( (l,index) => {
          return (<div key={index} className="line">
            <span className="account">{l.account} </span>
            <span className="debit">{money(l.debit)}</span>
            <span className="credit">{money(l.credit)}</span> 
            <span className="notes">{l.note}</span> 
            <button onClick={() => removeLine(index)}>X</button>
          </div>
          )
        })}
        <TransactionLineInput onAdd={addLine}/>
      <div>
        <button onClick={handleClick}>Submit</button>
      </div>
    </div>
  </div>
  </div>)
}


