import { useState } from "react"
import { AccountDef,AccountType } from "../model/ledger"

export function NewAccount(props: { addNewAccount: (account:AccountDef) => void, accounts: string[] }) {
  const [account,setAccount] = useState<string>('')
  const [name,setName] = useState<string>('')
  const [creditNormal,setCreditNormal] = useState<boolean>(false)
  const [accountType,setAccountType] = useState<AccountType>(AccountType.Asset)
  const [beginningBalance,setBeginningBalance] = useState<number>(0)

  const handleAddClick = () => {
    if(props.addNewAccount){
      props.addNewAccount({
        account: account,
        name: name,
        credit_normal: creditNormal,
        type: accountType,
        beginning_balance: beginningBalance
      })
    }
  }

  return (<div className="account_add">    
    <h4>Add Account</h4>
    <div>
      <label>Account</label>
      <input name="account" type="text" placeholder="Account Name (e.g. COGS)" value={account} onChange={(e) => setAccount(e.target.value)} /> 
    </div>
    <div>
      <label>Verbose Name</label>
      <input name="account" type="text" placeholder="Verbose Account Name (e.g. Cost of Goods Solds)" value={name==''?account:name} onChange={(e) => setName(e.target.value)} /> 
    </div>
    <div onChange={(e) => console.log(e)}>
      <label>Account Type</label>
      <div className="account_type account_type_A">
        <input name="type" type="radio" value={AccountType.Asset} checked={accountType==AccountType.Asset} onChange={e => setAccountType(AccountType.Asset)} />
        Asset
      </div>
      <div className="account_type account_type_L">
        <input name="type" type="radio" value={AccountType.Liability} checked={accountType==AccountType.Liability} onChange={e => setAccountType(AccountType.Liability)} />
        Liability
      </div>
      <div className="account_type account_type_E">
        <input name="type" type="radio" value={AccountType.Equity} checked={accountType==AccountType.Equity} onChange={e => setAccountType(AccountType.Equity)} />
        Equity
      </div>
    </div>
    <div>
      <label>Credit Normal</label>
      <input type="checkbox" checked={creditNormal} onChange={(e) => setCreditNormal(e.target.checked)} />
    </div>
    <div>
      <label>Beginning Balance</label>
      <input name="beginningBalance" type="number" min={0} value={beginningBalance} onChange={(e) => setBeginningBalance(Number(e.target.value))} /> 
    </div>
    <div>
      <button onClick={() => handleAddClick()}>Add</button>
    </div>
  </div>
  )
}