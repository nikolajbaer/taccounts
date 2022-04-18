
interface TxnLine {
  account: string,
  debit: number,
  credit: number,
  note: string | null,
  data: any | null
}

export class TransactionValidationError extends Error { }

export class Transaction {
  ref: string | number
  date: Date
  lines: TxnLine[]
  comment: string

  constructor(ref: string | number | null = null,date: Date | null = null){
    this.ref = ref // TODO fill with crypto.randomUUID()?
    this.date = date == null ? new Date() : date
    this.lines = []
  }

  debit(account:string,amount:number,note:string | null = null, data: any | null = null){
    this.lines.push({
      account: account,
      debit: amount,
      credit: 0,
      note: note,
      data: data
    })
    return this
  }

  credit(account:string,amount:number,note:string | null = null, data: any | null = null){
    this.lines.push({
      account: account,
      debit: 0,
      credit: amount,
      note: note,
      data: data
    })
    return this
  }

  for(account:string){
    return this.lines.filter( l => l.account.startsWith(account) )
  }

  total_for(account:string){
    return {
      credit: this.for(account).reduce( (t,l) => t+l.credit, 0),
      debit: this.for(account).reduce( (t,l) => t+l.debit, 0),
    }
  }

  validate(){
    const debits = this.lines.reduce( (t,l) => t+l.debit, 0)
    const credits = this.lines.reduce( (t,l) => t+l.credit, 0)
    if(debits != credits){
      throw new TransactionValidationError("Credits and Debits do not match")
    }
    return this
  }

  add_comment(comment: string){
    this.comment = comment
    return this
  }

  accounts(){
    return this.lines.reduce( (a,l) => {
      a.push(l.account)
      return a
    },[])
  }
}

