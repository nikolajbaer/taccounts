import { money } from "../util/helpers"

export function TransactionDetail(props){
  return (<div className="txn_detail">
    <h4>{props.transaction.ref?props.transaction.ref:`Transaction #${props.transaction.index}`}</h4>
    <div>
      <div class="line header">
        <div>Account</div>
        <div>Debit</div>
        <div>Credit</div>
        <div>Notes</div>
      </div>
      {props.transaction.lines.map( l => {
        return (
        <div class="line">
            <span className="account">{l.account} </span>
            <span className="debit">{money(l.debit)}</span>
            <span className="credit">{money(l.credit)}</span> 
            <span className="notes">{l.notes}</span> 
        </div>
        )
      })}
      {props.editable?(
      <div class="line">
            <input type="text" className="account" value="" />
            <input type="number" className="debit" value="" />
            <input type="number" className="credit" value="" />
            <input type="text" className="notes" value="" />
            <button>add</button>
      </div>
      ):""} 
    </div>
  </div>)
}