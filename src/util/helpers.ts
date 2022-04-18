
export function money(amount:number,show_zero:boolean = false){
  if(!show_zero && (amount == 0 || amount == null)){
    return ""
  }else if(show_zero && amount == null){
    amount = 0
  }

  const val = Math.abs(amount).toLocaleString('en-US',{
    style:"currency",
    currency:'USD',
    maximumFractionDigits: 0 // consider maybe we want to see precise amount?
  })
  if(amount < 0){ return `(${val})` }
  return val
}

