import { TAccount } from "./ui/taccount"
import { Transaction } from "./model/transaction"
import { Ledger } from "./model/ledger"

const test_ledger = new Ledger()
  .asset("Inventory")
  .asset("Cash")
  .equity("SE")
  .asset("AR")
  .equity("COGS")
  .equity("Revenue")
  .txn(
    new Transaction()
          .debit('Inventory/Widgets',10)
          .debit('Inventory/DooDads',10)
          .debit('Cash',2)
          .credit('SE',22)
          .add_comment('Initial investment')
          .validate()
  ).txn(
    new Transaction()
          .debit('AR',5)
          .credit('Revenue',5)
          .debit('COGS',5)
          .credit('Inventory/Widgets',5)
          .add_comment('Invoice #1')
          .validate()
  ).txn(
    new Transaction()
          .debit('Cash',5)
          .credit('AR',5)
          .add_comment("Invoice #1 Paid")
          .validate()
  )
//DEBUG
window.ledger = test_ledger

export function App(props) {

  return (
    <>
      <nav>
        <h1>T-Account Tool (alpha)</h1>
      </nav>
      <section className="accounts">
        {test_ledger.active_accounts().map( account_def => {
          return (<TAccount
            account_def={account_def}
            lines={test_ledger.lines_for(account_def.account)}
          ></TAccount>)
        })}
      </section>
    </>
  )
}
