import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Chip,
  LinearProgress,
  TextField,
  TableSortLabel,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { getData } from "../service/getData";
import { Problem } from "../types/response";
import { handleDifficultyColor } from "../utils/chipsColorChanges";

type SortableColumn = keyof Problem;
const ProblemTable = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Problem[]>([]);
  const [totalPageElements, setTotalPageElements] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const coloumnList: Array<keyof Problem> = [
    "id",
    "title",
    "tags",
    "difficultyTitle",
    "likesCount",
    "solved",
  ];

  const coloumns = [
    "Id",
    "Title",
    "Tags",
    "Difficulty Title",
    "Likes Count",
    "Solved",
  ];
  const handlePaginationChange = (_event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    setLoading(true);
    getData(page, rowsPerPage)
      .then((data) => {
        setTotalPageElements(data?.total || 0);
        setData(data?.data || []);
      })
      .finally(() => setLoading(false));
  }, [page, rowsPerPage]);

  const filteredData = data
    .filter((problem) =>
      problem.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortColumn === null) return 0;

      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

  const handleSortClick = (column: SortableColumn) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  return (
    <div className="container m-auto border rounded-md">
      {loading && <LinearProgress />}
      <TextField
        label="Search by Title"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        fullWidth
        className="mb-7"
      />
      {filteredData.length === 0 && !loading ? (
        <div className="text-center">Nothing found</div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              {coloumnList.map((value: keyof Problem, index: number) => (
                <TableCell
                  key={value}
                  sortDirection={sortColumn === value ? sortOrder : false}
                >
                  {value !== "tags" && (
                    <TableSortLabel
                      active={sortColumn === value}
                      direction={sortColumn === value ? sortOrder : "asc"}
                      onClick={() => handleSortClick(value)}
                    >
                      {coloumns[index]}
                    </TableSortLabel>
                  )}
                  {value === "tags" && <>{coloumns[index]}</>}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((problem) => (
              <TableRow key={problem.id}>
                <TableCell>{problem.id}</TableCell>
                <TableCell>{problem.title}</TableCell>
                <TableCell>
                  {problem.tags.map((tag) => (
                    <Chip
                      color="primary"
                      style={{ margin: "5px" }}
                      key={tag.id}
                      label={tag.name}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  <div
                    className={`${handleDifficultyColor(
                      problem.difficultyTitle
                    )} py-2 text-center rounded-full text-white`}
                  >
                    {problem.difficultyTitle}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 justify-start">
                    <ThumbUpIcon fontSize="medium" />
                    <span>{problem.likesCount}</span>
                    <ThumbDownIcon fontSize="medium" />
                    <span>{problem.dislikesCount}</span>
                  </div>
                </TableCell>
                <TableCell>{problem.solved}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
        component="div"
        count={totalPageElements}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={handlePaginationChange}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default ProblemTable;
