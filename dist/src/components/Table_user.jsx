import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import { TbCircleCheckFilled, TbCircleXFilled, TbFaceId } from 'react-icons/tb'
import { AiFillEdit } from 'react-icons/ai';
import { BsFillTrash3Fill } from 'react-icons/bs';

const TableUser = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token'); // Substitua pelo seu token real
    const apiUrl = 'http://20.226.34.88:5000/config/get_user';
    function update() {
      fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(data => setData(data))
        .catch(err => console.error(err));
    }
    update();
    const interval = setInterval(update, 5000);
    return () => {
      clearInterval(interval);
    }
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: 'icon',
        accessor: 'icon',
        Cell: ({ row }) => {
          const { user } = row.original;
          const firstLetter = user.charAt(0).toUpperCase();
          return (
            <div className='icon'>
              <span>{firstLetter}</span>
            </div>
          )
        }
      }, {
        Header: 'Nome',
        accessor: 'user',
        Cell: ({ value }) => {
          return (
            <div className='infos_row'>
              <span>{value}</span>
              {/* <span className='email'>{email}</span> */}
            </div>
          )
        }
      }, {
        Header: 'Role',
        accessor: 'role',
        Cell: ({ value }) => {
          return (
            <div className="last_event">{value === 'admin' ? 'Administrador' : 'Operador'}</div>
          )
        }
      }, {
        Header: 'Action',
        accessor: 'id',
        Cell: ({ value }) => {
          return (
            <div className='action'>
              <a href=""><AiFillEdit /></a>
              <a href=""><BsFillTrash3Fill /></a>
            </div>
          )
        }
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <table {...getTableProps()} id='cadTable'>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default TableUser;
