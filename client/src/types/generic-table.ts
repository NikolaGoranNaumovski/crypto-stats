import { type SxProps } from "@mui/material";
import { type JSX } from "react";

export type HeaderProps = {
  sx?: SxProps;
  handleClick?: (rowId?: string) => void;
  label?: string | JSX.Element;
}

export type TableDataProps<T> = {
  sx?: SxProps;
  label?: (data?: T, index?: number) => string | JSX.Element;
}