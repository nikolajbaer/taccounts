import { useState,useEffect,useRef } from "react"
import { LedgerSerializer } from "./model/ledgerserializer"
import { LedgerView } from "./ui/ledgerview"
import { Ledger } from "./model/ledger"
import { Transaction } from "./model/transaction"
import { NewLedger } from "./ui/newledger"

export function App() {
  const [ledger,setLedger] = useState<Ledger|null>(null)

  const [showLedgerExport,setShowLedgerExport]  = useState<boolean>(false)
  const [showLedgerImport,setShowLedgerImport]  = useState<boolean>(false)
  const [showNewLedger,setShowNewLedger]  = useState<boolean>(false)

  useEffect(() => {
    const loaded_ledger = loadFromLocalStorage()
    if(loaded_ledger!=null){
      setLedger(loaded_ledger)
    }else{
      setLedger(new Ledger())
    }
  },[])

  const saveToLocalStorage = (ledger:Ledger): void => {
    if(window.localStorage){
      window.localStorage.setItem(ledger.name,JSON.stringify(ledger))
      window.localStorage.setItem("current_ledger",ledger.name)
    }
  }

  const loadFromLocalStorage = (): Ledger|null => {
    if(window.localStorage){
      let key = window.localStorage.getItem("current_ledger")
      if(!key){ key = "My Ledger" }
      const data = window.localStorage.getItem(key)
      if(data){
        try{
          const obj = JSON.parse(data)
          const new_ledger = new Ledger(key)
          new_ledger.deserialize(obj)
          return new_ledger 
        }catch(e){
          console.error("Error parsing ledger data in local storage. Clearing",key,data,e)
          window.localStorage.removeItem(key)
        }
      }
    }
    return null 
  }

  const changeLedger = (new_ledger:Ledger):void => {
    saveToLocalStorage(new_ledger)
    setLedger(new_ledger)
    setShowNewLedger(false)
  }

  return (
    <>
      <nav>
        <h1>T-Accounts</h1>
        <div className="right">
          <button onClick={() => setShowLedgerImport(true)}>Import</button>
          <button onClick={() => setShowLedgerExport(true)}>Export</button>
          <button onClick={() => setShowNewLedger(true)}>New</button>
        </div>
      </nav>
      {showNewLedger?(
        <div className="modal">
          <div className="modal-content">
            <button tabIndex={-1} onClick={() => setShowNewLedger(false)} className="close">✕</button>
            <NewLedger
              currentLedger={ledger}
              onNewLedger={ledger => changeLedger(ledger)}
              templates={[]} // TODO
            ></NewLedger>
          </div>
        </div>
      ):''}
      {ledger!=null?<LedgerView 
        ledger={ledger} 
        onLedgerChange={() => saveToLocalStorage(ledger)}
      />:''}
  </>
  )
}
