import { AccountType } from '../model/ledger'

function show(amount){
  if(amount == 0 || amount == null){
    return ""
  }
  return amount.toLocaleString('en-US',{
    style:"currency",
    currency:'USD',
    maximumFractionDigits: 0 // consider maybe we want to see precise amount?
  })
}

function is_credit_normal(account_type: AccountType){
  switch(account_type){
    case AccountType.Liability:
    case AccountType.ContraAsset:
    case AccountType.Equity:
      return true
  }
  return false
}

export function TAccount(props) {

  const bb = (props.account_def.beginning_balance?(
    is_credit_normal(props.account_def.account_type)?(
        <div className="line">
          <div className="debit">
            BB
            {show(props.account_def.beginning_balance)}
          </div>
          <div className="credit"></div>
          <div className="note"></div>
        </div>
    ):(
        <div className="line">
          <div className="debit"></div>
          <div className="credit">
            BB {show(props.account_def.beginning_balance)}
          </div>
          <div className="note"></div>
        </div>
    )
  ):'')

  return (
    <div className="taccount">
      <h4>{props.account_def.account}</h4>
      <div className="lines">
        {bb}
        {props.lines.map( l => {
          return (<div className="line">
            <div className="prefix"></div>
            <div className="debit">{show(l.credit)}</div>
            <div className="credit">{show(l.debit)}</div>
            <div className="note">{l.note}</div>
          </div>)
        })}
      </div>
    </div>
  )
}