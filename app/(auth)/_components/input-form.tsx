interface IInputFormProps {
  label: string;
  type: string;
  name: string;
}
const InputForm = ({ label, type = "text", name }: IInputFormProps) => {
  return (
    <div className="relative group">
      <input
        type={type}
        required
        className="form-control block w-full h-[4em] px-4 py-5 text-sm font-normal text-gray-700 bg-white border border-gray-300 rounded-sm  m-0 focus:text-gray-700 focus:bg-white focus:border-blue-500 focus:outline-none peer"
      />
      <label
        htmlFor={name}
        className="transform transition-all bg-transparent absolute top-4 ml-4 text-muted-foreground
        peer-valid:-top-3 
        peer-valid:text-sm 
        peer-valid:px-2 
        peer-valid:border
        peer-valid:bg-white         
        group-focus-within:-top-3 
        group-focus-within:px-2
        group-focus-within:text-sm
        group-focus-within:border        
        group-focus-within:bg-white
        group-focus-within:text-blue-500 
        "
      >
        {label}
      </label>
    </div>
  );
};

export default InputForm;
