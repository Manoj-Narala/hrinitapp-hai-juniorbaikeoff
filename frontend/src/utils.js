/**
 * Maps a business value score to its corresponding text, value range, and color.
 */
export const getBusinessValueInfo = (score) => {
  const s = Number(score);
  if (s >= 9) { // 9-10
    return {
      text: "Critical",
      range: "Legal / Compliance",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      textColor: "text-orange-800"
    };
  }
  if (s >= 7) { // 7-8
    return {
      text: "Significant Value",
      range: "> £1m",
      color: "text-blue-700",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800"
    };
  }
  if (s >= 5) { // 5-6
    return {
      text: "High Value",
      range: "£500k - £1m",
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800"
    };
  }
  if (s >= 3) { // 3-4
    return {
      text: "Medium Value",
      range: "£250k - £500k",
      color: "text-gray-700",
      bgColor: "bg-gray-200",
      textColor: "text-gray-800"
    };
  }
  // 1-2
  return {
    text: "Low Value",
    range: "< £250k",
    color: "text-gray-500",
    bgColor: "bg-gray-200",
    textColor: "text-gray-800"
  };
};
