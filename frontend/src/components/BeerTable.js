import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  withStyles
} from "@material-ui/core";
import { Stack } from '@mui/material';
import EnhancedTableHead from "./plugins/EnhancedTableHead";
import unixToDateString from "./functions/unixToDateString";
import HighlightedInformation from "./plugins/HighlightedInformation";
import ShowIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = theme => ({
  tableWrapper: {
    overflowX: "auto",
    width: "100%"
  },
  blackBackground: {
    backgroundColor: theme.palette.primary.main
  },
  contentWrapper: {
    padding: theme.spacing(3),
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(2)
    },
    width: "100%"
  },
  dBlock: {
    display: "block !important"
  },
  dNone: {
    display: "none !important"
  },
  firstData: {
    paddingLeft: theme.spacing(3)
  }
});

const rows = [
  {
    id: "name",
    numeric: false,
    label: "Name"
  },
  {
    id: "slogan",
    numeric: false,
    label: "Slogan"
  },
  {
    id: "date",
    numeric: false,
    label: "Date"
  },
  {
    id: "actions",
    numeric: false,
    label: "Actions"
  }
];

const rowsPerPage = 5;

function BeerTable(props) {
  const { transactions, deleteBeer, history, classes } = props;
  const [page, setPage] = useState(0);

  const handleChangePage = useCallback(
    (_, page) => {
      setPage(page);
    },
    [setPage]
  );

  if (transactions && transactions.length > 0) {
    return (
      <div className={classes.tableWrapper}>
        <Table aria-labelledby="tableTitle">
          <EnhancedTableHead rowCount={transactions.length} rows={rows} />
          <TableBody>
            {transactions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((transaction, index) => (
                <TableRow hover tabIndex={-1} key={index}>
                  <TableCell
                    component="th"
                    scope="row"
                    className={classes.firstData}
                  >
                    {transaction.name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {unixToDateString(transaction.timestamp)}
                  </TableCell>
                  <TableCell component="th" scope="row">
                  <Stack direction="row" spacing={2}>
                    <Button variant="outlined" endIcon={<ShowIcon />} onClick={() => history.push('/show/' + transaction.id)}>Show</Button>
                    <Button variant="outlined" endIcon={<EditIcon />} onClick={() => history.push('/edit/' + transaction.id)}>Edit</Button>
                    <Button variant="contained" color="primary" endIcon={<DeleteIcon />} disableElevation onClick={() => deleteBeer(transaction.id)}>Remove</Button>
                  </Stack>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={transactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "Previous Page"
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page"
          }}
          onChangePage={handleChangePage}
          classes={{
            select: classes.dNone,
            selectIcon: classes.dNone,
            actions: transactions.length > 0 ? classes.dBlock : classes.dNone,
            caption: transactions.length > 0 ? classes.dBlock : classes.dNone
          }}
          labelRowsPerPage=""
        />
      </div>
    );
  }
  return (
    <div className={classes.contentWrapper}>
      <HighlightedInformation>
        No transactions.
      </HighlightedInformation>
    </div>
  );
}

BeerTable.propTypes = {
  theme: PropTypes.object.isRequired,
  deleteBeer: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(BeerTable);
