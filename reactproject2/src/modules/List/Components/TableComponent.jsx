import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Paper } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from '@material-ui/core/TablePagination';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
    cursor: 'pointer',
  },
  column: {
    display: 'flex',
    padding: 4,
    marginRight: 20,
  },
  empty: {
    textAlign: 'center',
  },
});
class TableComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  createSortHandler = property => (event) => {
    const { onSort } = this.props;
    onSort(event, property);
  };

 renderHeadings = () => {
   const { columns, orderBy, order } = this.props;
   return (
     columns.map(Tcell => (
       <TableCell
         key={Tcell.field}
         align={Tcell.align}
         sortDirection={orderBy === Tcell.field ? order : false}
       >
         <Tooltip
           title="Sort"
           enterDelay={300}
         >
           <TableSortLabel
             active={orderBy === Tcell.field}
             direction={order}
             onClick={this.createSortHandler(Tcell.field)}
           >
             {Tcell.label}
           </TableSortLabel>
         </Tooltip>
       </TableCell>
     ), this));
 }



renderRows = () => {
  const {
    classes,
    data,
    columns,
    onSelect,
  } = this.props;
  return (
    data.map((users, index) => {
        const { id } = users;
      return (
        <TableRow
          key={index}
          className={classes.row}
          hover
        >
          {
            columns.map(Tcell => (
              <TableCell key={Tcell.field} align={Tcell.align} onClick={() => onSelect(id)}>
                {Tcell.format ? Tcell.format(users[Tcell.field]) : users[Tcell.field]}
              </TableCell>
            ))
          }
        </TableRow>
      );
    }));
}

render() {
  const {
    classes,
    id,
    count,
    page,
    onChangePage,
    rowsPerPage,
  } = this.props;
  return (
    <Paper className={classes.root}>
      <Table className={classes.table} key={id}>
        <TableHead>
          <TableRow>
            {this.renderHeadings()}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {this.renderRows()}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        rowsPerPageOptions={[]}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        onChangePage={onChangePage}
      />
    </Paper>
  );
}
}
TableComponent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  columns: PropTypes.array,
  data: PropTypes.array,
  id: PropTypes.string,
  order: PropTypes.string,
  orderBy: PropTypes.string,
  onSelect: PropTypes.func,
  onSort: PropTypes.func,
  rowsPerPage: PropTypes.number,
  count: PropTypes.number,
  onChangePage: PropTypes.func,
  page: PropTypes.number.isRequired,
};
TableComponent.defaultProps = {
  columns: [],
  data: [],
  id: '',
  order: '',
  orderBy: '',
  rowsPerPage: 100,
  onSelect: () => {},
  onSort: () => {},
  count: 100,
  onChangePage: () => {},
};
export default withStyles(styles)(TableComponent);
