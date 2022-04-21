import { useState,useEffect } from "react"
import { Ledger } from "../model/ledger"
import { Transaction } from "../model/transaction"

export function TransactionLog(props: { txnSelected: (txn_index:number) => void, selected: number|null, ledger: Ledger }){
  const [stickySelected,setStickySelected] = useState<null|number>(null)

  function txnSelected(txn_index:number,sticky:boolean=false){
    if(props.txnSelected){
      props.txnSelected(txn_index)
    }
    if(sticky){
      setStickySelected(txn_index)
    }
  }

  const handleNewTransaction = () => {
    alert("Todo new transaction")
  }

  return (
    <div className="txn_log"
      onMouseLeave={() => stickySelected?txnSelected(stickySelected):null }
    >
      <h4>Transaction History</h4>
      <div className={"txn" + (props.selected==0?" selected":"")} 
        onClick={() => txnSelected(0,true)}
        onMouseOver={() => txnSelected(0)}
      >
      BB</div>
      {props.ledger.transactions.map( (txn:Transaction) => {
        const selected = txn.index != null && props.selected != null && txn.index > props.selected
        return (
          <div 
            key={txn.index}
            className={"txn" + ((props.selected==txn.index)?" selected":"") + (selected?" after":"")} 
            onClick={() => txnSelected(txn.index,true)}
            onMouseOver={() => txnSelected(txn.index)}
          >
            {(txn.ref)?txn.ref:(txn.index)}
          </div>
        )
      })} 
      <div className="txn new_txn" onClick={() => handleNewTransaction()}>+</div>
    </div>
  ) 
}