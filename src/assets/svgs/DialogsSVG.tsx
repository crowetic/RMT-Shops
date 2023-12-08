import { IconTypes } from "./IconTypes";

export const DialogsSVG: React.FC<IconTypes> = ({
  color,
  height,
  width,
  className
}) => {
  return (
    <svg
      className={className}
      height={height}
      width={width}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
    >
      <path d="M299.003-299.003h361.994v-361.994H299.003v361.994ZM197.694-140.001q-23.529 0-40.611-17.082-17.082-17.082-17.082-40.611v-564.612q0-23.529 17.082-40.611 17.082-17.082 40.611-17.082h564.612q23.529 0 40.611 17.082 17.082 17.082 17.082 40.611v564.612q0 23.529-17.082 40.611-17.082 17.082-40.611 17.082H197.694Zm0-45.384h564.612q4.616 0 8.463-3.846 3.846-3.847 3.846-8.463v-564.612q0-4.616-3.846-8.463-3.847-3.846-8.463-3.846H197.694q-4.616 0-8.463 3.846-3.846 3.847-3.846 8.463v564.612q0 4.616 3.846 8.463 3.847 3.846 8.463 3.846Zm-12.309-589.23V-185.385-774.615Z" />
    </svg>
  );
};