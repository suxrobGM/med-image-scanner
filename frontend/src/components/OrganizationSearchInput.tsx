"use client";

import {useEffect, useMemo, useState} from "react";
import {Autocomplete, TextField} from "@mui/material";
import CircularProgressIcon from "@mui/material/CircularProgress";
import {OrgShortDetailsDto, PagedResult} from "@/core/models";
import {ApiService} from "@/core/services";
import {debounce} from "@/core/utils";

interface OrganizationSearchInputProps {
  value?: OrgShortDetailsDto | null;
  onChange?: (value: OrgShortDetailsDto | null) => void;
}

export function OrganizationSearchInput(props: OrganizationSearchInputProps) {
  const [value, setValue] = useState<OrgShortDetailsDto | null>(props.value ?? null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<OrgShortDetailsDto[]>([]);

  const fetchOrganizations = useMemo(() => {
    const debouncedFetch = debounce(
      async (search: string, callback: (result: PagedResult<OrgShortDetailsDto>) => void) => {
        const result = await ApiService.ins.searchOrganization({
          search: search,
          page: 1,
          pageSize: 10,
        });

        callback(result);
      },
      400
    );

    return (search: string) =>
      new Promise<PagedResult<OrgShortDetailsDto>>((resolve) => debouncedFetch(search, resolve));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      setLoading(false);
      return;
    }

    setLoading(true);

    (async () => {
      try {
        const result = await fetchOrganizations(inputValue);

        if (signal.aborted) {
          return;
        }

        if (result.success && result.data) {
          setOptions(result.data);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, [inputValue, fetchOrganizations]);

  const handleChange = (newValue: OrgShortDetailsDto | null) => {
    setOptions(newValue ? [newValue, ...options] : options);
    setValue(newValue);
    props.onChange?.(newValue);
  };

  return (
    <Autocomplete
      value={value}
      options={options}
      getOptionLabel={(option) => `${option.name} - ${option.displayName}`}
      noOptionsText="No organizations found"
      loading={loading}
      autoComplete
      includeInputInList
      filterSelectedOptions
      onChange={(_, newValue) => handleChange(newValue)}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Organization"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgressIcon color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
