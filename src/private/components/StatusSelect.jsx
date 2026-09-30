import CustomSelect from "../../components/CustomSelect.jsx";

export default function StatusSelect({ disabled, onChange, options, value }) {
  return (
    <CustomSelect
      className="min-w-32"
      disabled={disabled}
      onChange={onChange}
      options={options}
      value={value}
    />
  );
}
