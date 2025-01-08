import React, { useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
import * as flagIcons from 'country-flag-icons/react/3x2';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './ui/command';
import { cn } from '@/lib/utils';

// Get metadata about countries
const getCountryName = (callingCode) => {
  try {
    // Remove the '+' if present
    const code = callingCode.replace(/^\+/, '');
    
    // Find the country for this calling code
    const country = getCountries().find(c => getCountryCallingCode(c) === code);
    
    if (!country) {
      throw new Error('Country not found');
    }

    const name = new Intl.DisplayNames(['en'], { type: 'region' }).of(country);
    return name || country;
  } catch (error) {
    console.error('Error getting country name:', error);
    return `Unknown (${callingCode})`;
  }
};

const code = getCountryCallingCode('AC')
console.log({code})

// Get all countries and their data
/* const fetchedCountries = getCountries()
console.log({fetchedCountries})

  fetchedCountries?.map(country => {
    const FlagComponent = flagIcons[country];
    return {
      code: `+${getCountryCallingCode(country)}`,
      country,
      name: getCountryName(country),
      FlagComponent
    };
  })
  .filter(country => country.FlagComponent) // Ensure we have a flag
  .sort((a, b) => a.name.localeCompare(b.name)); */

  const getCountriesData = () => {
    try {
      const countriesData = getCountries()
        .map(country => {
          const code = `+${getCountryCallingCode(country)}`;
          const FlagComponent = flagIcons[country];
          return {
            code,
            country,
            name: getCountryName(code),
            FlagComponent
          };
        })
        .filter(country => country.FlagComponent)
        .sort((a, b) => a.name.localeCompare(b.name));
  
      // For debugging: log each country object separately
      countriesData.forEach(country => {
        console.log(JSON.stringify(country, null, 2));
      });
  
      return countriesData;
    } catch (error) {
      console.error('Error in getCountriesData:', error);
      return [];
    }
  };


  const CountryCodeSelect = React.forwardRef(({ 
    onChange, 
    value = "+234", // Default to Nigeria
    className,
    ...props 
  }, ref) => {
    const [open, setOpen] = useState(false);
    const countries = useMemo(() => getCountriesData(), []);
    const selectedCountry = countries.find(c => c.code === value) || countries[0] || { code: value, name: getCountryName(value), FlagComponent: null };
  
    const handleSelect = (code) => {
      onChange(code);
      setOpen(false);
    };
  
    return (
      <Popover open={open} onOpenChange={setOpen} {...props}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-[200px] justify-between border-r-0 rounded-r-none focus:ring-0 focus:ring-offset-0",
              className
            )}
            ref={ref}
          >
            <span className="flex items-center gap-2">
              {selectedCountry.FlagComponent && <selectedCountry.FlagComponent className="w-5 h-4" />}
              <span>{selectedCountry.code}</span>
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0 md:ml-24 ml-10">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {countries?.map(({ code, name, FlagComponent, country }) => (
                
                <CommandItem
                  key={`${country}-${name}`}
                  onSelect={() => handleSelect(code)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === code ? "opacity-100" : "opacity-0"
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
    );
  });
  
  CountryCodeSelect.displayName = "CountryCodeSelect";
  
  export default CountryCodeSelect;

/*   const CountryCodeSelect = React.forwardRef(({ 
    onChange, 
    value = "+234", // Default to Nigeria
    className,
    ...props 
  }, ref) => {
    const [open, setOpen] = useState(false);
    const countries = useMemo(() => fetchedCountries, []);
    const [selectedCountry, setSelectedCountry] = useState(() => {
      return countries.find(c => c.code === value) || { code: value, name: 'Unknown', FlagComponent: null };
    });
  
    if (countries.length === 0) {
      return <div>Error loading countries data</div>;
    }
  
    const handleSelect = (code) => {
      const country = countries.find(c => c.code === code) || { code, name: 'Unknown', FlagComponent: null };
      setSelectedCountry(country);
      onChange(code);
      setOpen(false);
    };
  
    return (
      <Popover open={open} onOpenChange={setOpen} {...props}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-[110px] justify-between border-r-0 rounded-r-none focus:ring-0 focus:ring-offset-0",
              className
            )}
            ref={ref}
          >
            <span className="flex items-center gap-2">
              {selectedCountry.FlagComponent && <selectedCountry.FlagComponent className="w-5 h-4" />}
              <span>{selectedCountry.code}</span>
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {countries.map(({ code, name, FlagComponent, country }) => (
                <CommandItem
                  key={`${country}-${name}`}
                  onSelect={() => handleSelect(code)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCountry.code === code ? "opacity-100" : "opacity-0"
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
    );
  });
  
  CountryCodeSelect.displayName = "CountryCodeSelect";
  

export default CountryCodeSelect; */

/* const getCountryName = (countryCode) => {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(countryCode)
  } catch (error) {
    return countryCode
  }
}

const countries = getCountries()
  .map(country => {
    const FlagComponent = flagIcons[country]
    return {
      code: `+${getCountryCallingCode(country)}`,
      country,
      name: getCountryName(country),
      FlagComponent
    }
  })
  .filter(country => country.FlagComponent)
  .sort((a, b) => a.name.localeCompare(b.name))

const CountrySelect = React.forwardRef(({ value, onChange, ...props }, ref) => {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const selectedCountry = countries.find(c => c.code === value) || countries[0]
  const FlagComponent = selectedCountry.FlagComponent

  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.includes(searchQuery)
  )

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[110px] justify-between px-3 font-normal border-r-0 rounded-r-none focus:ring-0 focus:ring-offset-0"
        >
          <span className="flex items-center gap-2">
            {FlagComponent && <FlagComponent className="w-5 h-4" />}
            <span>{value}</span>
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder="Search country..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-y-auto">
            {filteredCountries.map(({ code, name, FlagComponent, country }) => (
              <CommandItem
                key={country}
                onSelect={() => {
                  onChange(code)
                  setOpen(false)
                  setSearchQuery('')
                }}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === code ? "opacity-100" : "opacity-0"
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
  )
})

CountrySelect.displayName = "CountrySelect"

export {CountrySelect} */