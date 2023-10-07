import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import { TbCircleCheckFilled, TbCircleXFilled, TbFaceId } from 'react-icons/tb'
import { AiFillEdit } from 'react-icons/ai';
import { BsFillTrash3Fill } from 'react-icons/bs';

const TableDriver = ({ onEdit }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Substitua pelo seu token real
    const apiUrl = 'http://20.226.34.88:5000/config/get_driver';
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

  const handleOnEdit = (data) => {
    onEdit(data);
  }

  const handleOnDelete = async (data) => {
    const id = data.id;
    try {
      const response = await fetch('http://20.226.34.88:5000/delete_driver/' + id, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
    }
  }

  const columns = React.useMemo(
    () => [
      {
        Header: 'id',
        accessor: 'id',
      }, {
        Header: 'Nome',
        accessor: 'nome',
        Cell: ({ row }) => {
          const { nome, cpf } = row.original;
          return (
            <div className='infos_row'>
              <span>{nome}</span>
              <span>{cpf}</span>
            </div>
          )
        }
      }, {
        Header: 'Caminhão',
        accessor: 'caminhao'
      }, {
        Header: 'Action',
        accessor: 'ts',
        Cell: ({ row }) => {
          return (
            <div className='action'>
              <a onClick={() => handleOnEdit(row.original)} ><AiFillEdit /></a>
              <a onClick={() => handleOnDelete(row.original)}><BsFillTrash3Fill /></a>
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

export default TableDriver;
