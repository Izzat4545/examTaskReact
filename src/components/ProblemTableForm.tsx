import React from "react";
import { TextField } from "@mui/material";

interface ProblemTableFormProps {
  searchTerm: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProblemTableForm: React.FC<ProblemTableFormProps> = ({
  searchTerm,
  handleSearchChange,
}) => {
  return (
    <TextField
      fullWidth
      label="Search by Title"
      variant="outlined"
      value={searchTerm}
      onChange={handleSearchChange}
      className="w-[350px]"
    />
  );
};

export default ProblemTableForm;
