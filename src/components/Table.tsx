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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TableSortLabel,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { getData } from "../service/getData";
import { Problem } from "../types/response";
import { handleDifficultyColor } from "../utils/chipsColorChanges";

const ProblemTable = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Problem[]>([]);
  const [totalPageElements, setTotalPageElements] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [hasCheckerFilter, setHasCheckerFilter] = useState<boolean>(true);
  const [hasSolution, setHasSolution] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>("");

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
    getData(page, rowsPerPage, "", sortBy, hasCheckerFilter, hasSolution)
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
  }, [hasCheckerFilter, hasSolution, page, rowsPerPage, sortBy]);
  // FOR SEARCHING
  useEffect(() => {
    setLoading(true);
    setPage(1);
    getData(1, rowsPerPage, searchTerm, "", true, true)
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
  }, [rowsPerPage, searchTerm]);

  const handleHasCheckerFilter = (event: SelectChangeEvent) => {
    if (event.target.value === "Yes") {
      setHasCheckerFilter(true);
    } else {
      setHasCheckerFilter(false);
    }
  };

  const handleHasSolutionFilter = (event: SelectChangeEvent) => {
    if (event.target.value === "Yes") {
      setHasSolution(true);
    } else {
      setHasSolution(false);
    }
  };

  const handleSortClick = (column: keyof Problem) => {
    let sortLabel: string;

    // Handle exceptions for likesCount and difficultyTitle
    if (column === "likesCount") {
      sortLabel = "rating";
    } else if (column === "difficultyTitle") {
      sortLabel = "difficulty";
    } else {
      sortLabel = column as string;
    }

    // Handle the case where the column starts with "-"
    if (!sortBy.startsWith("-")) {
      setSortBy(`-${sortLabel}`);
    } else {
      setSortBy(sortLabel);
    }
  };

  return (
    <>
      <LinearProgress
        className={`${loading ? "visible" : "invisible"} absolute top-0 left-0`}
      />
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
              Include checker
            </InputLabel>
            <Select
              labelId="demo-ckecker-select-label"
              id="demo-checker-select"
              label="hasCheckerFilter"
              value={hasCheckerFilter ? "Yes" : "No"}
              onChange={handleHasCheckerFilter}
            >
              <MenuItem value={"Yes"}>Yes</MenuItem>
              <MenuItem value={"No"}>No</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="demo-solution-select-label">
              Include solution
            </InputLabel>
            <Select
              labelId="demo-solution-select-label"
              id="demo-solution-select"
              label="Solution"
              value={hasSolution ? "Yes" : "No"}
              onChange={handleHasSolutionFilter}
            >
              <MenuItem value={"Yes"}>Yes</MenuItem>
              <MenuItem value={"No"}>No</MenuItem>
            </Select>
          </FormControl>
        </div>
        {data.length === 0 && !loading && !error && (
          <div className="text-center">Nothing found</div>
        )}
        {/* JUST INCASE SERVER IS DOWN */}
        {!loading && error && (
          <div className="text-center">
            Something went wrong, please check your network
          </div>
        )}
        {data.length > 0 && !loading && !error && (
          <Table className="border rounded-lg my-4">
            <TableHead>
              <TableRow>
                {coloumnList.map((value: keyof Problem, index: number) => (
                  <TableCell key={value}>
                    {value !== "tags" && (
                      <TableSortLabel
                        active={sortBy === value || sortBy === `-${value}`}
                        direction={sortBy.startsWith("-") ? "desc" : "asc"}
                        onClick={() => handleSortClick(value)}
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
            <TableBody>
              {data.map((problem) => (
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
