import React from "react";
import { TableHead, TableRow, TableCell, TableSortLabel } from "@mui/material";

interface ProblemTableHeaderProps {
  handleSortClick: (column: string) => void;
  sortBy: string;
  coloumns: string[];
}

const ProblemTableHeader: React.FC<ProblemTableHeaderProps> = ({
  handleSortClick,
  sortBy,
  coloumns,
}) => {
  return (
    <TableHead>
      <TableRow>
        {coloumns.map((value, index) => (
          <TableCell key={value}>
            {value !== "tags" && (
              <TableSortLabel
                active={
                  sortBy === value.toLowerCase() ||
                  sortBy === `-${value.toLowerCase()}`
                }
                direction={sortBy.startsWith("-") ? "desc" : "asc"}
                onClick={() => handleSortClick(value.toLowerCase())}
              >
                <div className="font-bold">{coloumns[index]}</div>
              </TableSortLabel>
            )}
            {value === "tags" && (
              <div className="font-bold">{coloumns[index]}</div>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default ProblemTableHeader;
