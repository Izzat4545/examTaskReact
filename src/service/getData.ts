import { Difficulties, ProblemTableProps } from "../types/response";

export const getProblems = async (
  page: number,
  pageSize: number,
  searchTitle: string,
  sortBy: string,
  has_checker: boolean | string,
  has_solution: boolean | string,
  difficulty: string
) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await fetch(
      `https://kep.uz/api/problems?title=${searchTitle}&difficulty=${difficulty}&ordering=${sortBy}&has_checker=${has_checker}&has_solution=${has_solution}&page=${page}&page_size=${pageSize}`
    );
    const responseData: ProblemTableProps = await response.json();
    console.log(
      `https://kep.uz/api/problems?title=${searchTitle}&difficulty=${difficulty}&ordering=${sortBy}&has_checker=${has_checker}&has_solution=${has_solution}&page=${page}&page_size=${pageSize}`
    );
    return responseData;
  } catch (error) {
    throw error;
  }
};

export const getDifficulties = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await fetch(`https://kep.uz/api/problems/difficulties`);
    const responseData: Difficulties[] = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
};
