import { money } from "../util/helpers"

export function TransactionDetail(props){
  return (<div className="txn_detail">
    <h4>{props.transaction.ref?props.transaction.ref:`Transaction #${props.transaction.index}`}</h4>
    <div>
      <div class="line">
        <div>Account</div>
        <div>Debit</div>
        <div>Credit</div>
        <div>Notes</div>
      </div>
      {props.transaction.lines.map( l => {
        return (
        <div class="line">
            <input type="text" disabled className="account" value={l.account} />
            <input type="number" disabled className="debit" value={l.debit} />
            <input type="number" disabled className="credit" value={l.credit} />
            <input type="text" disabled className="notes" value={l.notes} />
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