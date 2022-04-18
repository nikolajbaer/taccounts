import { AccountType } from '../model/ledger'

// TODO move to helpers
function show(amount){
  if(amount == 0 || amount == null){
    return ""
  }

  const val = Math.abs(amount).toLocaleString('en-US',{
    style:"currency",
    currency:'USD',
    maximumFractionDigits: 0 // consider maybe we want to see precise amount?
  })
  if(amount < 0){ return `(${val})` }
  return val
}

export function TAccount(props) {

  // Show beginning balance (BB)
  const credit_normal = props.account_def.credit_normal
  const bb = (props.account_def.beginning_balance?(
    <div className="line">
      <div className="linestart">{credit_normal?"":<strong>BB</strong>}</div>
      <div className="debit">{credit_normal?"":show(props.account_def.beginning_balance)}</div>
      <div className="credit">{credit_normal?show(props.account_def.beginning_balance):""}</div>
      <div className="note"></div>
      <div className="lineend">{credit_normal?<strong>BB</strong>:""}</div>
    </div>
  ):'')

  return (
    <div className="taccount">
      <h4>
        {props.account_def.name?props.account_def.name:props.account_def.account}
        &nbsp;<span className={"account_type account_type_"+props.account_def.type}>&nbsp;{props.account_def.type}&nbsp;</span>
      </h4>
      <div className="lines">
        {bb}
        {props.lines.map( l => {
          return (<div className="line">
            <div className="linestart"></div>
            <div className="debit">{show(l.debit)}</div>
            <div className="credit">{show(l.credit)}</div>
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
            <div className="debit">{credit_normal?"":show(props.balance)}</div>
            <div className="credit">{credit_normal?show(props.balance):""}</div>
        </div>
      </div>
    </div>
  )
}

const ACCOUNT_TYPES_VERBOSE = {}
ACCOUNT_TYPES_VERBOSE[AccountType.Asset] = "asset"
ACCOUNT_TYPES_VERBOSE[AccountType.Liability] = "liability"
ACCOUNT_TYPES_VERBOSE[AccountType.Equity] = "equity"
ACCOUNT_TYPES_VERBOSE[AccountType.ContraAsset] = "contra-asset"
ACCOUNT_TYPES_VERBOSE[AccountType.ContraLiability] = "contra-liability"