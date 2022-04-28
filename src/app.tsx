import { useState,useEffect,useRef } from "react"
import { LedgerSerializer } from "./model/ledgerserializer"
import { LedgerView } from "./ui/ledgerview"
import { Ledger } from "./model/ledger"
import { Transaction } from "./model/transaction"

const LOCAL_STORAGE_KEY = "ledger"

export function App() {
  const [ledger,setLedger] = useState<Ledger|null>(null)

  const [showLedgerExport,setShowLedgerExport]  = useState<boolean>(false)
  const [showLedgerImport,setShowLedgerImport]  = useState<boolean>(false)

  useEffect(() => {
    const loaded_ledger = loadFromLocalStorage(LOCAL_STORAGE_KEY)
    if(loaded_ledger!=null){
      setLedger(loaded_ledger)
    }else{
      setLedger(create_sample_ledger())
    }
  },[])

  const saveToLocalStorage = (key:string): void => {
    if(window.localStorage){
      window.localStorage.setItem(key,JSON.stringify(ledger))
    }
  }

  const loadFromLocalStorage = (key:string): Ledger|null => {
    console.log("loading from local storage")
    if(window.localStorage){
      const data = window.localStorage.getItem(key)
      if(data){
        try{
          const obj = JSON.parse(data)
          const new_ledger = new Ledger()
          new_ledger.deserialize(obj)
          console.log("new ledger",new_ledger)
          return new_ledger 
        }catch(e){
          console.error("Error parsing ledger data in local storage. Clearing",key,data,e)
          window.localStorage.removeItem(key)
        }
      }
    }
    return null 
  }

  return (
    <>
      <nav>
        <h1>T-Accounts</h1>
        <div className="right">
          <button onClick={() => setShowLedgerImport(true)}>Import</button>
          <button onClick={() => setShowLedgerExport(true)}>Export</button>
        </div>
      </nav>
      {ledger!=null?<LedgerView 
        ledger={ledger} 
        onLedgerChange={() => saveToLocalStorage(LOCAL_STORAGE_KEY)}
      />:''}
  </>
  )
}

function create_sample_ledger():Ledger {
  const sample_ledger = new Ledger("Test Ledger")
    .asset("Inventory")
    .asset("Cash",5)
    .asset("AR",0,"Accounts Receivable")
    .asset("PPE",100,"Property, Plants & Equipment")
    .liability("Sales Tax Payable")
    .equity("SE",0,"Stockholder's Equity")
    .equity("COGS",0,"Cost of Goods Sold",false)
    .equity("Revenue")
    .txn(
      new Transaction()
            .debit('Inventory',10)
            .debit('Inventory',10)
            .debit('Cash',2)
            .credit('SE',22,"New Investor")
            .add_comment('Initial investment')
            .validate()
    ).txn(
      new Transaction()
            .debit('AR',5)
            .credit('Sales Tax Payable',1)
            .credit('Revenue',4)
            .debit('COGS',5)
            .credit('Inventory',5)
            .add_comment('Invoice #1')
            .validate()
    ).txn(
      new Transaction()
            .debit('Cash',5)
            .credit('AR',5)
            .add_comment("Invoice #1 Paid")
            .validate()
    )
    return sample_ledger
}
