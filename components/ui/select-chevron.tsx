interface SelectChevronProps {
  width?: number;
  height?: number;
  strokeWidth?: number;
}

export const SelectChevron: React.FC<SelectChevronProps> = ({
  width = 8,
  height = 8,
  strokeWidth = 3,
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
