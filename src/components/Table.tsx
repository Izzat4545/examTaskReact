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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
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
  const [error, setError] = useState<boolean>(false);
  const [hasCheckerFilter, setHasCheckerFilter] = useState<boolean | undefined>(
    undefined
  );
  const [hasSolution, setHasSolution] = useState<boolean | undefined>(
    undefined
  );

  const coloumnList: Array<keyof Problem> = [
    "id",
    "title",
    "tags",
    "difficultyTitle",
    "likesCount",
    "solved",
  ];

  const coloumns = ["Id", "Title", "Tags", "Difficulty", "Rating", "Solved"];
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
        setError(false);
        setPage(data.page);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [page, rowsPerPage]);

  const filteredData = data
    .filter((problem) =>
      problem.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((problem) => {
      if (hasCheckerFilter === undefined) {
        return true;
      } else {
        return problem.hasChecker === hasCheckerFilter;
      }
    })
    .filter((problem) => {
      if (hasSolution === undefined) {
        return true;
      } else {
        return problem.hasSolution === hasSolution;
      }
    })
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

  const handleHasCheckerFilter = (event: SelectChangeEvent) => {
    if (event.target.value === "All") {
      setHasCheckerFilter(undefined);
    } else if (event.target.value === "HasChecker") {
      setHasCheckerFilter(true);
    } else {
      setHasCheckerFilter(false);
    }
  };

  const handleHasSolutionFilter = (event: SelectChangeEvent) => {
    if (event.target.value === "All") {
      setHasSolution(undefined);
    } else if (event.target.value === "HasSolution") {
      setHasSolution(true);
    } else {
      setHasSolution(false);
    }
  };

  return (
    <>
      {loading && <LinearProgress className="absolute top-0 left-0" />}
      <div className="container m-auto my-11">
        <div className="flex gap-2 items-center">
          <TextField
            fullWidth
            label="Search by Title"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-[350px]"
          />
          <FormControl fullWidth>
            <InputLabel id="demo-ckecker-select-label">
              Select Checker
            </InputLabel>
            <Select
              labelId="demo-ckecker-select-label"
              id="demo-checker-select"
              label="Age"
              onChange={handleHasCheckerFilter}
            >
              <MenuItem value={"All"}>All</MenuItem>
              <MenuItem value={"HasChecker"}>Has checker</MenuItem>
              <MenuItem value={"NoChecker"}>No checker</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="demo-solution-select-label">
              Select solution
            </InputLabel>
            <Select
              labelId="demo-solution-select-label"
              id="demo-solution-select"
              label="Solution"
              onChange={handleHasSolutionFilter}
            >
              <MenuItem value={"All"}>All</MenuItem>
              <MenuItem value={"HasSolution"}>Has solution</MenuItem>
              <MenuItem value={"NoSolution"}>No solution</MenuItem>
            </Select>
          </FormControl>
        </div>
        {filteredData.length === 0 && !loading && !error && (
          <div className="text-center">Nothing found</div>
        )}
        {/* JUST INCASE SERVES IS DOWN */}
        {!loading && error && (
          <div className="text-center">
            Something went wrong please check your network
          </div>
        )}
        {filteredData.length > 0 && !loading && !error && (
          <Table className="border rounded-lg my-4">
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
                        <div className="font-bold">{coloumns[index]}</div>
                      </TableSortLabel>
                    )}
                    <div className="font-bold">
                      {value === "tags" && <>{coloumns[index]}</>}
                    </div>
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
    </>
  );
};

export default ProblemTable;
