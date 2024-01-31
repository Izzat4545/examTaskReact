export const handleDifficultyColor = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case "beginner":
      return "bg-[#4CAF50]"; // Green
    case "basic":
      return "bg-[#2196F3]"; // Blue
    case "normal":
      return "bg-[#FFC107]"; // Yellow
    case "medium":
      return "bg-[#8BC34A]"; // Lime Green (you can adjust the color code)
    case "hard":
      return "bg-[#FF5722]"; // Red
    case "advanced":
      return "bg-[#9C27B0]"; // Purple
    default:
      return "bg-red-400"; // Set a default color or handle it as needed
  }
};
