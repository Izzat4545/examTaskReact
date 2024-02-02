import React from "react";
import { TablePagination } from "@mui/material";

interface ProblemTablePaginationProps {
  page: number;
  rowsPerPage: number;
  totalPageElements: number;
  handleChangePage: (_event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProblemTablePagination: React.FC<ProblemTablePaginationProps> = ({
  page,
  rowsPerPage,
  totalPageElements,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  return (
    <TablePagination
      rowsPerPageOptions={[10, 20, 50]}
      component="div"
      count={totalPageElements}
      rowsPerPage={rowsPerPage}
      page={page - 1}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
};

export default ProblemTablePagination;
