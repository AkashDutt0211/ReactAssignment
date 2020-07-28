import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TableComponent from './Components/TableComponent';
import callApi from '../../libs/api';

class TraineeList extends Component {
    constructor(props) {
      super(props);
      this.state = {
        listValue: '',
        order: 'desc',
        orderBy: '',
        page: 0,
        loading: true,
        errAlert: '',
      };
    }
  
    handleChangePage = (event, pages) => {
      this.setState({
        loading: true,
        page: pages,
      }, () => {
    const { page } = this.state;
    callApi({ page: page+1 }, '/users', 'get').then((response) => {
            this.setState({
              listValue: response.data.data,
              loading: false,
            });
          });
      }); 
    };  
  
  componentDidMount = () => {
    const { page } = this.state;
    callApi({ page: page +1 }, 'users', 'get').then((response) => {
      this.setState({
        listValue: response.data.data,
        per_page: response.data.per_page,
        totalUsers: response.data.total,
        total_pages: response.data.total_pages,
        loading: false,
      });
    })
      .catch((err) => {
        this.setState({
          errAlert: err,
          loading: false,
        });
      });
  }

  handleSelect = (id) => {
    const { history } = this.props;
    history.push({
        pathname: `/template/:${id}`,
        state: { userId: id  },
      })
  };
  
  
  render() {
    const {
      order,
      orderBy,
      page,
      listValue,
      loading,
      totalUsers,
    } = this.state;
            return (
              <div>
                {loading ?  <h1>Please Wait...</h1> : 

                <TableComponent
                  id="id"
                  data={listValue}
                  columns={[{
                    field: 'first_name',
                    label: 'First Name',
                    align: 'center',
                  }, {
                    field: 'email',
                    label: 'Email Address',
                    format: value => value && value.toUpperCase(),
                  },
                  {
                    field: 'id',
                    label: 'ID',
                    align: 'right',
                  }]}
                  order={order}
                orderBy={orderBy}
                onSort={this.handleSort}
                onSelect={this.handleSelect}
                count={totalUsers}
                page={page}
                dataLength={listValue.length}
                loading={loading}
                rowsPerPage={6}
                onChangePage={this.handleChangePage}
                />}
              </div>
            );
          }
        }
  TraineeList.propTypes = {
    history: PropTypes.shape(
      {
        length: PropTypes.number.isRequired, action: PropTypes.string.isRequired,
      },
    ),
  };
  TraineeList.defaultProps = {
    history: {},
  };
  export default TraineeList;