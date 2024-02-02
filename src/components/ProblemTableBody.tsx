import React from "react";
import { TableBody } from "@mui/material";
import ProblemTableRow from "./ProblemTableRow";
import { Problem } from "../types/response";

interface ProblemTableBodyProps {
  data: Problem[];
}

const ProblemTableBody: React.FC<ProblemTableBodyProps> = ({ data }) => {
  return (
    <TableBody>
      {data.map((problem) => (
        <ProblemTableRow key={problem.id} problem={problem} />
      ))}
    </TableBody>
  );
};

export default ProblemTableBody;
