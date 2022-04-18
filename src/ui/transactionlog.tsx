import { useState,useEffect } from "preact/hooks"

export function TransactionLog(props){
  const [stickySelected,setStickySelected] = useState<null|number>(null)

  function txnSelected(txn_index:number,sticky:boolean=false){
    if(props.txnSelected){
      props.txnSelected(txn_index)
    }
    if(sticky){
      setStickySelected(txn_index)
    }
  }

  function handleNewTransaction(e){
    alert("Todo new transaction")
  }

  return (
    <div className="txn_log"
      onMouseLeave={() => txnSelected(stickySelected)}
    >
      <h4>Transaction History</h4>
      <div class={"txn" + (props.selected==0?" selected":"")} 
        onClick={() => txnSelected(0,true)}
        onMouseOver={() => txnSelected(0)}
      >
      BB</div>
      {props.ledger.transactions.map( txn => {
        return (
          <div 
            class={"txn" + ((props.selected==txn.index)?" selected":"") + (txn.index>props.selected?" after":"")} 
            onClick={() => txnSelected(txn.index,true)}
            onMouseOver={() => txnSelected(txn.index)}
          >
            {(txn.ref)?txn.ref:(txn.index)}
          </div>
        )
      })} 
      <div class="txn new_txn" onClick={handleNewTransaction}>+</div>
    </div>
  ) 
}