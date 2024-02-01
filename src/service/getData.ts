import { ProblemTableProps } from "../types/response";

export const getData = async (
  page: number,
  pageSize: number,
  searchTitle: string,
  sortBy: string,
  has_checker: boolean,
  has_solution: boolean
) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await fetch(
      `https://kep.uz/api/problems?title=${searchTitle}&ordering=${sortBy}&has_checker=${has_checker}&has_solution=${has_solution}&page=${page}&page_size=${pageSize}`
    );
    const responseData: ProblemTableProps = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
};
