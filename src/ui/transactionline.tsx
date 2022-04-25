import { useState } from "react"
import { Transaction } from "../model/transaction"

export function TransactionLineInput(props: { 
    onAdd?: (account:string,debit:number|null,credit:number|null,note:string) => void,
    accounts: string[]
  }){

  const [account,setAccount] = useState<string>('')
  const [debit,setDebit] = useState<number|null>(null)
  const [credit,setCredit] = useState<number|null>(null)
  const [note,setNote] = useState<string>('')
  const [suggestedAccounts,setSuggestedAccounts] = useState<string[]>([])

  const validAccount = (): boolean => {
    const _account = account.toLowerCase()
    return props.accounts.filter( a => a.toLowerCase() == _account).length > 0
  }

  const handleAdd = (): void => {
    if(!validAccount()){ return }
    if(props.onAdd){
      props.onAdd(account,debit,credit,note)
      setAccount('') 
      setDebit(null)
      setCredit(null)
      setNote('')
      console.log("clearing line on add")
    }
  }

  const handleAccountChange = (account:string): void => {
    if(account == ""){
      setSuggestedAccounts([])
      return
    }
    const matching = props.accounts.filter( a => {
      return a.toLowerCase().startsWith(account.toLowerCase())
    })
    setSuggestedAccounts(matching) 
    setAccount(account)
  }

  const handleValueChange = (debit:string|null,credit:string|null): void => {
    if(debit != null){
      setDebit(Number(debit))
      setCredit(null)
    }else{
      setDebit(null)
      setCredit(Number(credit))
    }
  }

  return (<div className="line">
    <div>
      <input type="text" className="account" placeholder="Account Name" onChange={(e) => handleAccountChange(e.target.value)} />
      <ul className="autocomplete">
        {suggestedAccounts.map( s => (<li key={s}>{s}</li>))}
      </ul>
    </div>
    <input type="text" className="debit" value={debit!=null?debit:''} onChange={(e) => handleValueChange(e.target.value,null)} />
    <input type="text" className="credit" value={credit!=null?credit:''} onChange={(e) => handleValueChange(null,e.target.value)} />
    <input type="text" className="notes" value={note?note:''} placeholder="Notes" onChange={(e) => setNote(e.target.value)} />
    <button onClick={() => handleAdd()}>Add</button>
  </div>
  )
}
