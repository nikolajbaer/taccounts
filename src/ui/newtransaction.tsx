import { useEffect, useState } from "react"
import { Transaction,TransactionValidationError } from "../model/transaction"

export function NewTransactionModal(props: { handleClose: (transaction:Transaction) => void }){
  const [transaction,setTransaction] = useState<Transaction|null>(null)

  useEffect( () => {
    if(transaction == null){
      setTransaction(new Transaction())
    }
  })

  const handleClick = () => {
    if(transaction == null){ return }
    if(transaction.is_valid()){
      console.log(transaction)
      props.handleClose(transaction)
    }else{
      alert("Transaction not valid")
    }
  }

  return (<div className="txn_add">
    <h4>Add Transaction</h4>
    <div>
      <div>
        <input type="text" placeholder="Transaction Reference# (blank for auto-id)" />
      </div>
      <div className="line header">
        <div>Account</div>
        <div>Debit</div>
        <div>Credit</div>
        <div>Notes</div>
      </div>
      {transaction!=null?(transaction.lines.map( l => {
        return (<div className="line">
              <input type="text" className="account" value="" />
              <input type="number" className="debit" value="" />
              <input type="number" className="credit" value="" />
              <input type="text" className="notes" value="" />
              <button>add</button>
        </div>
        )
      })):''}
      <div>
        <button onClick={handleClick}>Submit</button>
      </div>
    </div>
  </div>)
}

//function TransactionLine(props: {})