"use client";

import {useEffect, useMemo, useState} from "react";
import {Autocomplete, TextField} from "@mui/material";
import CircularProgressIcon from "@mui/material/CircularProgress";
import {PagedResult, UserShortDetailsDto} from "@/core/models";
import {ApiService} from "@/core/services";
import {debounce} from "@/core/utils";

interface UserSearchInputProps {
  organizationName?: string;
  value?: UserShortDetailsDto | null;
  onChange?: (value: UserShortDetailsDto | null) => void;
}

export function UserSearchInput(props: UserSearchInputProps) {
  const [value, setValue] = useState<UserShortDetailsDto | null>(props.value ?? null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<UserShortDetailsDto[]>([]);

  const fetchUsers = useMemo(() => {
    const debouncedFetch = debounce(
      async (search: string, callback: (result: PagedResult<UserShortDetailsDto>) => void) => {
        const result = await ApiService.ins.searchUsers({
          search: search,
          page: 1,
          pageSize: 10,
          organizationName: props.organizationName,
        });

        callback(result);
      },
      400
    );

    return (search: string) =>
      new Promise<PagedResult<UserShortDetailsDto>>((resolve) => debouncedFetch(search, resolve));
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
        const result = await fetchUsers(inputValue);

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
  }, [inputValue, fetchUsers]);

  const handleChange = (newValue: UserShortDetailsDto | null) => {
    setOptions(newValue ? [newValue, ...options] : options);
    setValue(newValue);
    props.onChange?.(newValue);
  };

  return (
    <Autocomplete
      value={value}
      options={options}
      getOptionLabel={(option) => `${option.firstName} ${option.lastName} - ${option.email}`}
      noOptionsText="No users found"
      loading={loading}
      autoComplete
      includeInputInList
      filterSelectedOptions
      onChange={(_, newValue) => handleChange(newValue)}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="User"
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
