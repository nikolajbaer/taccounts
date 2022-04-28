import { useEffect,useRef } from "react"

export function money(amount:number,show_zero:boolean = false){
  if(!show_zero && (amount == 0 || amount == null)){
    return ""
  }else if(show_zero && amount == null){
    amount = 0
  }

  const val = Math.abs(amount).toLocaleString('en-US',{
    style:"currency",
    currency:'USD',
    maximumFractionDigits: (amount > 2 || amount  == 0)?0:2, // consider maybe we want to see precise amount?
  })
  if(amount < 0){ return `(${val})` }
  return val
}


type DescribableFunction = {
  (event: KeyboardEvent): void;
};
// From https://usehooks.com/useEventListener/
// Hook
export function useEventListener(eventName: string, handler: DescribableFunction, element: Window | Document | Element = window){
  // Create a ref that stores handler
  const savedHandler = useRef<DescribableFunction>();

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      // Make sure element supports addEventListener
      // On 
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;

      // Create event listener that calls handler function stored in ref
      const eventListener = (event:Event) => {
        if(savedHandler.current){
          savedHandler.current(<KeyboardEvent>event);
        }
      }

      // Add event listener
      element.addEventListener(eventName, eventListener);

      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element] // Re-run if eventName or element changes
  );
};