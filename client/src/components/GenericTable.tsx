import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  Pagination,
  CircularProgress,
  type SxProps,
} from "@mui/material";
import React, { useState } from "react";
import type { HeaderProps, TableDataProps } from "../types/generic-table";

const TableWrapper = styled(Box)(() => ({
  flex: 1,
  height: "100%",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  border: "1px solid rgba(0, 0, 0, 0.12)",
}));

const TableHeaderRow = styled(TableRow)(() => ({
  backgroundColor: "#1a1f3a",
  "& .MuiTableCell-head": {
    color: "#00ff41",
    borderBottom: "1px solid #00ff41",
    fontWeight: 500,
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
}));

const PaginationWrapper = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px",
  borderTop: "1px solid rgba(0, 255, 65, 0.2)",
}));

const TableStyled = styled(TableContainer)(() => ({
  backgroundColor: "#0f172a",
  border: "1px solid #00ff41",
  boxShadow: "0 0 20px rgba(0, 255, 65, 0.2)",
  flex: 1,
  display: "flex",
  flexDirection: "column",
}));

const PaginationTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
}));

const StyledBodyTableRow = styled(TableRow)<{ isclickable: string }>(
  ({ isclickable }) => ({
    transition: "all 0.3s ease",
    cursor: JSON.parse(String(isclickable)) ? "pointer" : "default",

    "&:hover": {
      backgroundColor: "#1a1f3a",
      boxShadow: "0 0 10px rgba(0, 255, 65, 0.1)",
    },
  })
);

const StyledTableHeaderCell = styled(TableCell)(() => ({
  fontSize: "0.875rem",
  textTransform: "none",
  backgroundColor: "inherit",
  color: "#00ff41",
  borderBottom: "1px solid #00ff41",
}));

const StyledBodyTableCell = styled(TableCell)(() => ({
  color: "#00ff41",
  borderBottom: "1px solid rgba(0, 255, 65, 0.2)",
  fontSize: "0.875rem",
}));

const StyledBodyTableContent = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  height: "100%",
}));

const StyledIsLoadingTableCell = styled(TableCell)(() => ({
  padding: "64px 0",
  textAlign: "center",
  color: "#00cc33",
}));

type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

const getPaginationRange = <T,>(data: PaginatedResponse<T>): string => {
  if (!data) return "";
  const { page, limit, total } = data;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  return `${start}-${end} out of ${total}`;
};

interface Props<T> {
  searchTerm: string;
  emptyStateTitle: string;
  emptyStateDescription: string;
  includeSelectedRowId?: boolean;
  styleTableBody?: SxProps;
  isLoading: boolean;
  headerProps: HeaderProps[];
  tableDataProps: TableDataProps<T>[];
  handleRowClick?: (id: string) => void;
  handlePageChange: (value: number) => void;
  data: PaginatedResponse<T>;
  handleMenuClick?: (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    rowId: string
  ) => void;
}

export const GenericTable = <T extends { id: string }>({
  data,
  searchTerm,
  isLoading,
  emptyStateTitle,
  headerProps,
  styleTableBody,
  tableDataProps,
  handlePageChange,
  handleRowClick,
  emptyStateDescription,
  includeSelectedRowId,
}: Props<T>) => {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const handleRowElementClick = (rowId: string) => {
    handleRowClick?.(rowId);
    setSelectedRowId(includeSelectedRowId ? rowId : null);
  };

  return (
    <TableWrapper>
      <Table sx={{ tableLayout: "fixed", width: "100%" }}>
        <TableHead>
          <TableHeaderRow>
            {headerProps.map((item, index) => (
              <StyledTableHeaderCell
                sx={item.sx}
                onClick={() => item.handleClick?.()}
                key={item.label?.toString() || String(index)}
              >
                {item.label}
              </StyledTableHeaderCell>
            ))}
          </TableHeaderRow>
        </TableHead>
      </Table>
      <TableStyled sx={styleTableBody}>
        <Table sx={{ tableLayout: "fixed", width: "100%", height: "100%" }}>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <StyledIsLoadingTableCell colSpan={6}>
                  <Box display="flex" justifyContent="center">
                    <CircularProgress />
                  </Box>
                </StyledIsLoadingTableCell>
              </TableRow>
            ) : data.data.length > 0 ? (
              data.data.map((row, index) => (
                <StyledBodyTableRow
                  isclickable={JSON.stringify(!!includeSelectedRowId)}
                  onClick={() => handleRowElementClick?.(row.id)}
                  key={row.id}
                  sx={{
                    backgroundColor:
                      selectedRowId === row.id ? "#1a1f3a" : "inherit",
                  }}
                >
                  {tableDataProps.map((item) => (
                    <StyledBodyTableCell
                      key={item.label?.toString()}
                      sx={item.sx}
                    >
                      <StyledBodyTableContent>
                        {item.label?.(
                          row,
                          index + data.limit * (data.page - 1)
                        )}
                      </StyledBodyTableContent>
                    </StyledBodyTableCell>
                  ))}
                </StyledBodyTableRow>
              ))
            ) : (
              <TableRow>
                <StyledIsLoadingTableCell colSpan={6}>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                      {emptyStateTitle}
                    </Typography>
                    <Typography variant="body2">
                      {searchTerm
                        ? `No results found for: "${searchTerm}"`
                        : emptyStateDescription}
                    </Typography>
                  </Box>
                </StyledIsLoadingTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableStyled>

      <PaginationWrapper>
        <PaginationTypography variant="caption">
          {getPaginationRange(data)}
        </PaginationTypography>
        <Pagination
          page={data.page}
          size="small"
          count={
            data.total && data.limit ? Math.ceil(data.total / data.limit) : 0
          }
          onChange={(_, value) => handlePageChange(value)}
        />
      </PaginationWrapper>
    </TableWrapper>
  );
};
