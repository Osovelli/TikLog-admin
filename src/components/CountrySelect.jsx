import React, { useState, useMemo } from "react"
import countries from "world-countries"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

export const CountrySelect = ({ value, onChange }) => {
  const [open, setOpen] = useState(false)

  // Format countries data for our use
  const formattedCountries = useMemo(() => {
    return countries?.map((country) => ({
      name: country.name.common,
      flag: country.flag,
      code: country.idd.root + (country.idd.suffixes?.[0] || ""),
      // Remove the + sign if it exists in the root
      formattedCode: (country.idd.root + (country.idd.suffixes?.[0] || "")).replace("+", "")
    })).sort((a, b) => a.name.localeCompare(b.name))
  }, [])

  const selectedCountry = formattedCountries.find(
    country => country.formattedCode === value
  ) || formattedCountries.find(country => country.formattedCode === "234") // Default to Nigeria

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[100px] h-12 justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">{selectedCountry?.flag}</span>
            <span className="text-sm">+{selectedCountry?.formattedCode}</span>
          </div>
          <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search countries..." />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {formattedCountries.map((country) => (
              <CommandItem
                key={country.name}
                value={`${country.name} ${country.formattedCode}`}
                onSelect={() => {
                  onChange(country.formattedCode)
                  setOpen(false)
                }}
                className="flex items-center gap-2"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === country.formattedCode ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-base">{country.flag}</span>
                  <span className="flex-1 truncate">{country.name}</span>
                  <span className="text-gray-500 ml-auto">+{country.formattedCode}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}