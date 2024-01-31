export interface Tag {
  id: number;
  name: string;
}

export interface Problem {
  id: number;
  title: string;
  tags: Tag[];
  difficultyTitle: string;
  solved: number;
  likesCount: number;
  dislikesCount: number;
}

export interface ProblemTableProps {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: Problem[];
}
