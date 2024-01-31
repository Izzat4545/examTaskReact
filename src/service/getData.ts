import { ProblemTableProps } from "../types/response";

export const getData = async (page: number, pageSize: number) => {
  try {
    const response = await fetch(
      `https://kep.uz/api/problems?page=${page}&page_size=${pageSize}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData: ProblemTableProps = await response.json();

    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
