import * as React from "react"
import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { getCountries, getCountryCallingCode, AsYouType } from 'libphonenumber-js'
import * as flagIcons from 'country-flag-icons/react/3x2'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import CountryCodeSelect from "./GetCountryCode"

/* const getCountryName = (countryCode) => {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(countryCode)
  } catch (error) {
    return countryCode
  }
}

const countries = getCountries()
  .map(country => {
    const FlagComponent = (flagIcons)[country]
    return {
      code: `+${getCountryCallingCode(country)}`,
      country,
      name: getCountryName(country),
      FlagComponent
    }
  })
  .filter(country => country.FlagComponent)
  .sort((a, b) => a.name.localeCompare(b.name))

const PhoneInput = React.forwardRef(({ 
  label, 
  error, 
  className,
  onChange,
  value = '',
  ...props 
}, ref) => {
  const [countryCode, setCountryCode] = useState('+234')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [open, setOpen] = useState(false)

  const selectedCountry = countries.find(c => c.code === countryCode) || countries[0]
  const FlagComponent = selectedCountry.FlagComponent

  useEffect(() => {
    if (typeof value === 'string' && value !== '') {
      formatter.input(value)
      setCountryCode(formatter.getCountry() ? `+${getCountryCallingCode(getCountry())}` : '+234')
      setPhoneNumber(formatter.getNationalNumber())
    }
  }, [value])

  const handleCountryChange = (code) => {
    setCountryCode(code)
    setOpen(false)
    updatePhone(phoneNumber, code)
  }

  const handlePhoneChange = (e) => {
    const newValue = e.target.value
    setPhoneNumber(newValue)
    updatePhone(newValue, countryCode)
  }

  const updatePhone = (number) => {
    const formatter = new AsYouType()
    formatter.input(`${code}${number}`)
    
    if (onChange) {
      onChange({
        countryCode: code,
        nationalNumber: number,
        formattedNumber: formatter.getNumber()?.formatInternational() || ''
      })
    }
  }

  return (
    <div className={className}>
      {label && <Label htmlFor="phone">{label}</Label>}
      <div className="flex mt-1">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[110px] justify-between px-3 font-normal border-r-0 rounded-r-none focus:ring-0 focus:ring-offset-0"
            >
              <span className="flex items-center gap-2">
                {FlagComponent && <FlagComponent className="w-5 h-4" />}
                <span>{countryCode}</span>
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search country..." />
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup className="max-h-[200px] overflow-y-auto">
                {countries.map(({ code, name, FlagComponent }) => (
                  <CommandItem
                    key={code}
                    onSelect={() => handleCountryChange(code)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        countryCode === code ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center gap-2">
                      {FlagComponent && <FlagComponent className="w-5 h-4" />}
                      <div className="flex flex-col">
                        <span className="font-medium">{name}</span>
                        <span className="text-sm text-muted-foreground">{code}</span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <Input
          type="tel"
          id="phone"
          className={cn(
            "flex-1 rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0",
            error && "border-red-500"
          )}
          value={phoneNumber}
          onChange={handlePhoneChange}
          ref={ref}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
})

PhoneInput.displayName = "PhoneInput" */

const PhoneInput = React.forwardRef(({ 
  label, 
  error, 
  className,
  onChange,
  value = '',
  ...props 
}, ref) => {
  const [countryCode, setCountryCode] = useState('+234')
  const [phoneNumber, setPhoneNumber] = useState('')

  useEffect(() => {
    if (typeof value === 'string' && value !== '') {
      const formatter = new AsYouType()
      formatter.input(value)
      setCountryCode(formatter.getCountry() ? `+${getCountryCallingCode(formatter.getCountry())}` : '+234')
      setPhoneNumber(formatter.getNationalNumber())
    }
  }, [value])

  const handleCountryChange = (code) => {
    setCountryCode(code)
    updatePhone(phoneNumber, code)
  }

  const handlePhoneChange = (e) => {
    const newValue = e.target.value
    setPhoneNumber(newValue)
    updatePhone(newValue, countryCode)
  }

  const updatePhone = (number, code) => {
    const formatter = new AsYouType()
    formatter.input(`${code}${number}`)
    
    if (onChange) {
      onChange({
        countryCode: code,
        nationalNumber: number,
        formattedNumber: formatter.getNumber()?.formatInternational() || ''
      })
    }
  }

  return (
    <div className={className}>
      {label && <Label htmlFor="phone">{label}</Label>}
      <div className="flex mt-1">
        <CountryCodeSelect
          value={countryCode}
          onChange={handleCountryChange}
        />
        <Input
          type="tel"
          id="phone"
          className={cn(
            "flex-1 rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0",
            error && "border-red-500"
          )}
          value={phoneNumber}
          onChange={handlePhoneChange}
          ref={ref}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
})

PhoneInput.displayName = "PhoneInput"

export default PhoneInput