import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

interface ProblemTableFilterProps {
  filterValue: string;
  filterLabel: string;
  handleChange: (event: SelectChangeEvent<string>) => void;
  options: string[];
}

const ProblemTableFilter: React.FC<ProblemTableFilterProps> = ({
  filterValue,
  filterLabel,
  handleChange,
  options,
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{filterLabel}</InputLabel>
      <Select value={filterValue} onChange={handleChange}>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ProblemTableFilter;
