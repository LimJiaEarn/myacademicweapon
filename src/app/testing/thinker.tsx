
type ThinkerProps = {
    Value : number;
    setValue : React.Dispatch<React.SetStateAction<number>>;
    displayText : string;
}


const Thinker = ({Value, setValue, displayText} : ThinkerProps) => {
  return (
    <div className="bg-slate-100">

        <p>{Value}</p>

        <button onClick={()=>{
            setValue(Value+1);
        }}>
            +1 in Thinker
        </button>

        <p className="mt-4 text-xl">{displayText}</p>
    </div>
  )
}

export default Thinker