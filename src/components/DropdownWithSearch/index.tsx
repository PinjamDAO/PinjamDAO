import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDown } from "lucide-react"
import { useState } from "react"


export default function DropdownWithSearch({ options, label, selected, setSelected}: {options: string[], label: string, selected: string, setSelected: (s: string) => void}) {

  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
      className="flex justify-center items-center bg-white text-black w-96 h-12 p-5
      rounded-lg inset-shadow-sm inset-shadow-indigo-200 space-x-3">
        <div className={selected ? 'text-black' : 'text-gray-500'}>
          {selected ? selected : `Select a ${label}`}
        </div>
          <ChevronDown className="size-4 opacity-50"/>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${label}...`}/>
          <CommandList>
            <CommandEmpty>No {label} found.</CommandEmpty>
            <CommandGroup>
              {options.map((option, i) => (
                <CommandItem
                  value={option}
                  key={i}
                  onSelect={() => {
                    setSelected(option)
                    setOpen(false)
                  }}
                >
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )

}