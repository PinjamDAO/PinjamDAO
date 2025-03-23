import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export default function Dropdown({ options, label, setSelected}: {options: string[], label: string, selected: string, setSelected: (s: string) => void}) {

  return (
    <Select onValueChange={setSelected}>
      <SelectTrigger className="flex justify-center items-center bg-white text-black w-96
      p-6 -mb-[1px] rounded-lg inset-shadow-sm inset-shadow-indigo-200 text-md">
        <SelectValue placeholder={`Select a ${label}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {
            options.map((option, i) => <SelectItem key={i} value={option}>{option}</SelectItem>)
          }
        </SelectGroup>
      </SelectContent>
    </Select>
  )

}
