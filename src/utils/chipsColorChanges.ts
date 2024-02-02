export const handleDifficultyColor = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case "beginner":
      return "bg-[#28c76f]";
    case "basic":
      return "bg-[#00cfe8]";
    case "normal":
      return "bg-[#4362eef0]";
    case "medium":
      return "bg-[#4d4ae8]";
    case "hard":
      return "bg-[#ea5455]";
    case "advanced":
      return "bg-[#ff9f43]";

    default:
      return "bg-slate-600";
  }
};
