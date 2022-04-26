import { useState } from "react"
import { AccountDef } from "../model/ledger"

export function TransactionLineInput(props: { 
    onAdd?: (account:string,debit:number|null,credit:number|null,note:string) => void,
    accounts: string[]
  }){

  const [account,setAccount] = useState<string>('')
  const [debit,setDebit] = useState<number|null>(null)
  const [credit,setCredit] = useState<number|null>(null)
  const [note,setNote] = useState<string>('')

  const handleAdd = (): void => {
    if(!account){
      return
    }
    if(props.onAdd){
      props.onAdd(account,debit,credit,note)
      setAccount('') 
      setDebit(null)
      setCredit(null)
      setNote('')
      console.log("clearing line on add",account,debit,credit,note)
    }
  }

 const handleValueChange = (debit:string|null,credit:string|null): void => {
    if(debit != null){
      if(!isNaN(Number.parseFloat(debit))){ 
        setDebit(Number.parseFloat(debit))
        setCredit(null)
      }
    }else if(credit != null){
      if(!isNaN(Number(credit))){
        setDebit(null)
        setCredit(Number.parseFloat(credit))
      }
    }
  }

  return (<div className="line">
    <select name="account" onChange={(e) => setAccount(e.target.value)}>
      <option value="">Select Account</option>
      {props.accounts.map( (account:string,i:number) => {
        return (<option key={account} value={account}>{account}</option>)
      })}
    </select>
    <input type="number" step="0.01" className="debit" value={debit!=null?debit:''} onChange={(e) => handleValueChange(e.target.value,null)} />
    <input type="number" step="0.01" className="credit" value={credit!=null?credit:''} onChange={(e) => handleValueChange(null,e.target.value)} />
    <input type="text" className="notes" value={note?note:''} placeholder="Notes" onChange={(e) => setNote(e.target.value)} />
    <button onClick={() => handleAdd()}>Add</button>
  </div>
  )
}
