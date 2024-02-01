import { ProblemTableProps } from "../types/response";

export const getData = async (page: number, pageSize: number) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await fetch(
      `https://kep.uz/api/problems?page=${page}&page_size=${pageSize}`
    );
    const responseData: ProblemTableProps = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
};
