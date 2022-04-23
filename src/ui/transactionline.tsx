import { useState } from "react"
import { Transaction } from "../model/transaction"

export function TransactionLineInput(props: { 
    onAdd?: (account:string,debit:number|null,credit:number|null,note:string) => void,
  }){

  const [account,setAccount] = useState<string>('')
  const [debit,setDebit] = useState<number|null>(null)
  const [credit,setCredit] = useState<number|null>(null)
  const [note,setNote] = useState<string>('')

  const handleAdd = () => {
    if(props.onAdd){
      props.onAdd(account,debit,credit,note)
      setAccount('') 
      setDebit(null)
      setCredit(null)
      setNote('')
    }
  }

  const handleAccountChange = (account:string) => {
    setAccount(account)
  }

  const handleValueChange = (debit:string|null,credit:string|null) => {
    if(debit != null){
      setDebit(Number(debit))
      setCredit(null)
    }else{
      setDebit(null)
      setCredit(Number(credit))
    }
  }

  return (<div className="line">
    <input type="text" className="account" placeholder="Account Name" onChange={(e) => handleAccountChange(e.target.value)} />
    <input type="text" className="debit" value={debit!=null?debit:''} onChange={(e) => handleValueChange(e.target.value,null)} />
    <input type="text" className="credit" value={credit!=null?credit:''} onChange={(e) => handleValueChange(null,e.target.value)} />
    <input type="text" className="notes" value={note?note:''} placeholder="Notes" onChange={(e) => setNote(e.target.value)} />
    <button onClick={() => handleAdd()}>Add</button>
  </div>
  )
}
