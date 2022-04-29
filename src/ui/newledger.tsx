import { useState } from "react"
import { create } from "react-test-renderer"
import { Ledger } from "../model/ledger"
import { create_test_ledger } from "../tests/utils"

export function NewLedger(props: { currentLedger?: Ledger|null, onNewLedger: (ledger:Ledger) => void, templates: Ledger[] }) {
  const [ledgerName,setLedgerName] = useState<string>('')

  const handleSampleLedger = () => {
    const ledger = create_test_ledger(ledgerName)
    if(props.onNewLedger){
      props.onNewLedger(ledger)
    }
  }

  const handleBlankLedger = () => {
    if(props.onNewLedger){
      props.onNewLedger(new Ledger(ledgerName))
    }
  }

  return (
    <div className="new_ledger">
      <h4>New Ledger</h4>
      <div>
        <input value={ledgerName} placeholder="My Ledger" onChange={e => setLedgerName(e.target.value)}/>
      </div>
      <div>
        <button onClick={() => handleSampleLedger()}>Sample Ledger</button>
        <button onClick={() => handleBlankLedger()}>Blank Ledger</button>
      </div>
    </div>
  )
}