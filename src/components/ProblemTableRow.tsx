import React from "react";
import { TableRow, TableCell, Chip } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { handleDifficultyColor } from "../utils/chipsColorChanges";
import { Problem } from "../types/response";

interface ProblemTableRowProps {
  problem: Problem;
}

const ProblemTableRow: React.FC<ProblemTableRowProps> = ({ problem }) => {
  return (
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
  );
};

export default ProblemTableRow;
