import React, { useState, useEffect } from "react";
import { LinearProgress, SelectChangeEvent, Table } from "@mui/material";
import ProblemTableForm from "./ProblemTableForm";
import ProblemTableFilter from "./ProblemTableFilter";
import ProblemTableHeader from "./ProblemTableHeader";
import ProblemTableBody from "./ProblemTableBody";
import ProblemTablePagination from "./ProblemTablePagination";
import { getDifficulties, getProblems } from "../service/getData";
import { Difficulties, Problem } from "../types/response";

const ProblemTable: React.FC = () => {
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
    setPage(1);
  };

  // TO HANDLE CHECKER AND SOLUTION FILTERS
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
      setPage(1);
      let filterArgument: string | boolean;

      if (event.target.value === "Yes") {
        filterArgument = true;
      } else if (event.target.value === "All") {
        filterArgument = "";
      } else {
        filterArgument = false;
      }

      setFilter({
        filterValue: event.target.value as string,
        filterArgument,
      });
    };
  // TO HANDKE DIFFICULTY FILTER
  function handleDifficultyFilter(event: SelectChangeEvent<string>) {
    setPage(1);
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

  const handleSortClick = (column: string) => {
    // Handle the sorting by adding "-" and removing it
    if (!sortBy.startsWith("-")) {
      setSortBy(`-${column}`);
    } else {
      setSortBy(column);
    }
  };
  // CENTRAL FETCHING FUNCTION RESPOSIBLE FOR ALL THE DATA CHANGES
  const fetchData = async () => {
    setLoading(true);

    try {
      const [difficultiesData, problemsData] = await Promise.all([
        getDifficulties(),
        getProblems(
          page,
          rowsPerPage,
          searchTerm,
          sortBy,
          hasCheckerFilter.filterArgument,
          hasSolution.filterArgument,
          selectedDifficulties?.value.toString() || ""
        ),
      ]);

      setDifficulties(difficultiesData);
      setTotalPageElements(problemsData?.total || 0);
      setData(problemsData?.data || []);
      setError(false);
      setPage(problemsData.page);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    rowsPerPage,
    searchTerm,
    sortBy,
    hasCheckerFilter.filterArgument,
    hasSolution.filterArgument,
    selectedDifficulties?.value,
  ]);

  return (
    <>
      <LinearProgress
        className={`${loading ? "visible" : "invisible"} absolute top-0 left-0`}
      />
      <div className="container relative m-auto my-11">
        {/* FILTERS */}
        <div className="grid bg-white px-2 sm:px-0 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {/* SEARCH INPUT */}
          <ProblemTableForm
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
          />
          {/* CHECKER FILTER */}
          <ProblemTableFilter
            filterLabel="Include checker"
            filterValue={hasCheckerFilter.filterValue}
            handleChange={checkerAndSolutionFilterHandler(setHasCheckerFilter)}
            options={["All", "Yes", "No"]}
          />
          {/* SOLUTION FILTER */}
          <ProblemTableFilter
            filterLabel="Include solution"
            filterValue={hasSolution.filterValue}
            handleChange={checkerAndSolutionFilterHandler(setHasSolution)}
            options={["All", "Yes", "No"]}
          />
          {/* DIFFICULTY FILTER */}
          <ProblemTableFilter
            filterLabel="Difficulty"
            filterValue={selectedDifficulties?.name || ""}
            handleChange={handleDifficultyFilter}
            options={difficulties.map((value) => value.name)}
          />
        </div>
        {/* IF NOTHING FOUND */}
        {data.length === 0 && !loading && !error && (
          <div className="h-[85vh] text-[25px] flex items-center justify-center">
            Nothing found
          </div>
        )}
        {/* IF SERVER IS DOWN OR BAD INTERNET */}
        {!loading && error && (
          <div className="h-[85vh] text-[25px] flex items-center justify-center">
            Something went wrong, please check your network
          </div>
        )}
        {/* TABLE */}
        {data.length > 0 && !loading && !error && (
          <div className="border my-3 rounded-md overflow-x-auto">
            <Table>
              <ProblemTableHeader
                handleSortClick={handleSortClick}
                sortBy={sortBy}
                coloumns={coloumns}
              />
              <ProblemTableBody data={data} />
            </Table>
            <ProblemTablePagination
              page={page}
              rowsPerPage={rowsPerPage}
              totalPageElements={totalPageElements}
              handleChangePage={handlePaginationChange}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ProblemTable;
