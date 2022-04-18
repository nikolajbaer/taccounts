import { money } from '../util/helpers'

export function TAccount(props) {

  const credit_normal = props.account_def.credit_normal
  const bb = (props.account_def.beginning_balance?(
    <div className="line">
      <div className="linestart">{credit_normal?"":<strong>BB</strong>}</div>
      <div className="debit">{credit_normal?"":money(props.account_def.beginning_balance)}</div>
      <div className="credit">{credit_normal?money(props.account_def.beginning_balance):""}</div>
      <div className="note"></div>
      <div className="lineend">{credit_normal?<strong>BB</strong>:""}</div>
    </div>
  ):"")

  return (
    <div className="taccount">
      <h4>
        {props.account_def.name?props.account_def.name:props.account_def.account}
        &nbsp;<span className={"account_type account_type_"+props.account_def.type}>&nbsp;{props.account_def.type}&nbsp;</span>
      </h4>
      <div className="lines">
        {bb}
        {props.lines.map( l => {
          return (<div className={"line" + ((props.selected==l.index)?" selected":"")}>
            <div className="linestart"></div>
            <div className="debit">{money(l.debit)}</div>
            <div className="credit">{money(l.credit)}</div>
            <div className="lineend">
              {l.note?(
                <div>
                  *
                  <div className="note">{l.note}</div>
                </div>
              ):''}
            </div>
          </div>)
        })}
        <div className="balance">
            <div className="debit">{credit_normal?"":money(props.balance,true)}</div>
            <div className="credit">{credit_normal?money(props.balance,true):""}</div>
        </div>
      </div>
    </div>
  )
}
