"use client";
import {FormControl, InputLabel, Select, MenuItem} from "@mui/material";

interface SelectTimezoneInputProps {
  name?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  fullWidth?: boolean;
  defaultValue?: string;
}

export const TIMEZONES = [
  {
    label: "United Kingdom / GMT +00:00",
    value: "UTC+00",
  },
  {
    label: "Central European / GMT +01:00",
    value: "UTC+01",
  },
  {
    label: "Eastern European / GMT +02:00",
    value: "UTC+02",
  },
  {
    label: "Moscow / GMT +03:00",
    value: "UTC+03",
  },
  {
    label: "Gulf / GMT +04:00",
    value: "UTC+04",
  },
  {
    label: "Central Asia / GMT +05:00",
    value: "UTC+05",
  },
  {
    label: "Bangladesh / GMT +06:00",
    value: "UTC+06",
  },
  {
    label: "Indochina / GMT +07:00",
    value: "UTC+07",
  },
  {
    label: "China / GMT +08:00",
    value: "UTC+08",
  },
  {
    label: "Japan / GMT +09:00",
    value: "UTC+09",
  },
  {
    label: "Australia / GMT +10:00",
    value: "UTC+10",
  },
  {
    label: "New Zealand / GMT +12:00",
    value: "UTC+12",
  },
  {
    label: "Azores / GMT -01:00",
    value: "UTC-01",
  },
  {
    label: "Brazil / GMT -02:00",
    value: "UTC-02",
  },
  {
    label: "Greenland / GMT -03:00",
    value: "UTC-03",
  },
  {
    label: "Atlantic/Eastern / GMT -04:00",
    value: "UTC-04",
  },
  {
    label: "Eastern / GMT -05:00",
    value: "UTC-05",
  },
  {
    label: "Central / GMT -06:00",
    value: "UTC-06",
  },
  {
    label: "Mountain / GMT -07:00",
    value: "UTC-07",
  },
  {
    label: "Pacific / GMT -08:00",
    value: "UTC-08",
  },
  {
    label: "Alaska / GMT -09:00",
    value: "UTC-09",
  },
  {
    label: "Hawaii / GMT -10:00",
    value: "UTC-10",
  },
  {
    label: "Samoa / GMT -11:00",
    value: "UTC-11",
  },
  {
    label: "Midway / GMT -12:00",
    value: "UTC-12",
  },
];

export function SelectTimezoneInput(props: SelectTimezoneInputProps) {
  const label = props.label ?? "Timezone";
  const name = props.name ?? "timezone";
  const defaultValue = props.defaultValue ?? "UTC+00";

  return (
    <FormControl fullWidth={props.fullWidth}>
      <InputLabel id={name}>{label}</InputLabel>
      <Select
        {...(props.value && { value: props.value })}
        {...(props.onChange && { onChange: (e) => props.onChange?.(e.target.value as string) })}
        name={name}
        variant="outlined"
        defaultValue={defaultValue}
        label={label}
      >
        {TIMEZONES.map((timezone) => (
          <MenuItem key={timezone.label} value={timezone.value}>
            {timezone.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
