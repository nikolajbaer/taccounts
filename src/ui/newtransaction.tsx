import { useEffect, useState } from "preact/hooks"
import { Transaction,TransactionValidationError } from "../model/transaction"

export function NewTransactionModal(props: { handleClose }){
  const [transaction,setTransaction] = useState<Transaction>(null)

  useEffect( () => {
    if(transaction == null){
      setTransaction(new Transaction())
    }
  })

  const handleClick = (e) => {
    try{
      transaction.validate()
      console.log(transaction)
      props.handleClose(transaction)
    }catch(TransactionValidationError){
      alert("Transaction not valid")
    }
  }

  return (<div className="txn_add">
    <h4>Add Transaction</h4>
    <div>
      <div>
        <input type="text" placeholder="Transaction Reference# (blank for auto-id)" />
      </div>
      <div class="line header">
        <div>Account</div>
        <div>Debit</div>
        <div>Credit</div>
        <div>Notes</div>
      </div>
      {transaction!=null?(transaction.lines.map( l => {
        return (<div class="line">
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