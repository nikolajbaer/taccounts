import { Transaction, TxnLine } from "../model/transaction"
import { money } from "../util/helpers"

export function TransactionDetail(props: { transaction: Transaction }){
  return (<div className="txn_detail">
    <h4>{props.transaction.ref?`${props.transaction.ref} (#${props.transaction.index})`:`Transaction #${props.transaction.index}`}</h4>
    <div>
      <div className="line header">
        <div>Account</div>
        <div>Debit</div>
        <div>Credit</div>
        <div>Notes</div>
      </div>
      {props.transaction.lines.map( (l:TxnLine,index:number) => {
        return (
        <div key={index} className="line">
            <span className="account">{l.account} </span>
            <span className="debit">{money(l.debit)}</span>
            <span className="credit">{money(l.credit)}</span> 
            <span className="notes">{l.note}</span> 
        </div>
        )
      })}
    </div>
  </div>)
}