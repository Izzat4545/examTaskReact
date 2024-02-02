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
import { getDifficulties, getProblems } from "../service/getData";
import { Difficulties, Problem } from "../types/response";
import { handleDifficultyColor } from "../utils/chipsColorChanges";
const ProblemTable = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Problem[]>([]);
  const [totalPageElements, setTotalPageElements] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [hasCheckerFilter, setHasCheckerFilter] = useState<{
    filterValue: string;
    filterArgument: string | boolean;
  }>({ filterArgument: "", filterValue: "" });
  const [hasSolution, setHasSolution] = useState<{
    filterValue: string;
    filterArgument: string | boolean;
  }>({ filterArgument: "", filterValue: "" });
  const [sortBy, setSortBy] = useState<string>("");
  const [difficulties, setDifficulties] = useState<Difficulties[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] =
    useState<Difficulties>();

  const coloumnList: Array<keyof Problem> = [
    "id",
    "title",
    "tags",
    "difficultyTitle",
    "likesCount",
    "solved",
  ];

  const coloumns = ["Id", "Title", "Tags", "Difficulty", "Rating", "Attempts"];

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
    getDifficulties().then((data) => setDifficulties(data));
    // Set page to 1 when filters are applied
    const currentPage =
      hasCheckerFilter.filterArgument ||
      hasSolution.filterArgument ||
      searchTerm ||
      selectedDifficulties?.value
        ? 1
        : page;

    getProblems(
      currentPage,
      rowsPerPage,
      searchTerm,
      sortBy,
      hasCheckerFilter.filterArgument,
      hasSolution.filterArgument,
      selectedDifficulties?.value.toString() || ""
    )
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
  }, [
    page,
    rowsPerPage,
    searchTerm,
    sortBy,
    hasCheckerFilter.filterArgument,
    hasSolution.filterArgument,
    selectedDifficulties?.value,
  ]);

  const checkerAndSolutionFilterHandler =
    (
      setFilter: React.Dispatch<
        React.SetStateAction<{
          filterValue: string;
          filterArgument: string | boolean;
        }>
      >
    ) =>
    (event: SelectChangeEvent<string>) => {
      let filterArgument: string | boolean;

      if (event.target.value === "Yes") {
        filterArgument = true;
      } else if (event.target.value === "All") {
        filterArgument = "";
      } else {
        filterArgument = false;
      }

      setFilter({
        filterValue: event.target.value,
        filterArgument,
      });
    };
  function handleDifficultyFilter(event: SelectChangeEvent<string>) {
    const selectedDifficultyValue = difficulties.find(
      (difficulty) => difficulty.name === event.target.value
    );
    if (selectedDifficultyValue) {
      setSelectedDifficulties({
        value: selectedDifficultyValue.value,
        name: selectedDifficultyValue.name,
      });
    }
  }

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
      <div className="container relative m-auto my-11">
        {/* MY FORM */}
        <div className="grid bg-white grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 z-10">
          <TextField
            fullWidth
            label="Search by Title"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-[350px]"
          />
          {/* CHEKCER FILTER */}
          <FormControl fullWidth>
            <InputLabel id="demo-ckecker-select-label">
              Include checker
            </InputLabel>
            <Select
              labelId="demo-ckecker-select-label"
              id="demo-checker-select"
              label="hasCheckerFilter"
              value={hasCheckerFilter.filterValue}
              onChange={checkerAndSolutionFilterHandler(setHasCheckerFilter)}
            >
              <MenuItem value={"All"}>All of them</MenuItem>
              <MenuItem value={"Yes"}>Yes</MenuItem>
              <MenuItem value={"No"}>No</MenuItem>
            </Select>
          </FormControl>
          {/* SOLUTION FILTER */}
          <FormControl fullWidth>
            <InputLabel id="demo-solution-select-label">
              Include solution
            </InputLabel>
            <Select
              labelId="demo-solution-select-label"
              id="demo-solution-select"
              label="Solution"
              value={hasSolution.filterValue}
              onChange={checkerAndSolutionFilterHandler(setHasSolution)}
            >
              <MenuItem value={"All"}>All of them</MenuItem>
              <MenuItem value={"Yes"}>Yes</MenuItem>
              <MenuItem value={"No"}>No</MenuItem>
            </Select>
          </FormControl>
          {/* DIFFICULTY FILTER */}
          <FormControl fullWidth>
            <InputLabel id="demo-solution-select-label">Difficulty</InputLabel>
            <Select
              labelId="demo-solution-select-label"
              id="demo-solution-select"
              label="Solution"
              value={selectedDifficulties?.name || ""}
              onChange={handleDifficultyFilter}
            >
              {difficulties.map((value) => (
                <MenuItem key={value.value} value={value.name}>
                  {value.name}
                </MenuItem>
              ))}
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
        {/* MY TABLE */}
        {data.length > 0 && !loading && !error && (
          <div className="overflow-x-auto">
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
                    <TableCell>
                      {problem.solved}/{problem.attemptsCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
