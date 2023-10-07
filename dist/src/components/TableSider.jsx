import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import { useParams } from 'react-router-dom';
import moment from 'moment-timezone';

const TableSider = ({ onTableRowClick, handleClickRow }) => {
  const [data, setData] = useState([]);
  const { id } = useParams();

  const sendTopic = async (path, type) => {
    handleClickRow(path, type);
  }

  useEffect(() => {
    function update() {
      fetch('http://20.226.34.88:5000/get_alertas/' + id)
        .then(response => response.json())
        .then(data => setData(data.sider.map((item) => ({ ...item, subsistema: 'Sider' }))))
        .catch(err => console.error(err));
    }
    update();

    const interval = setInterval(update, 5000);
    return () => {
      clearInterval(interval);
    }
  }, []);

  function formatarDataHora(dataString) {
    const data = new Date(dataString);

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Os meses são indexados a partir de 0
    const ano = data.getFullYear();
    const horas = String(data.getHours() + 3).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    const segundos = String(data.getSeconds()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
  }


  const columns = React.useMemo(
    () => [
      {
        Header: 'Subsistema',
        accessor: 'subsistema',
        Cell: ({ cell }) => {
          const name = cell.value;
          return (
            <button className={name}>
              <span>{name}</span>
            </button>
          )
        }
      }, {
        Header: 'Alerta', // Mensagem do subsistema
        accessor: 'nivel',
        Cell: ({ cell }) => {
          const { certeza } = cell.row.original;
          let aux = certeza * 100;
          return (<span>{aux.toFixed(2)}%</span>)
        }
      }, {
        Header: 'Latitude',
        accessor: 'lat',
      }, {
        Header: 'Longitude',
        accessor: 'longi',
      }, {
        Header: <span style={{ fontStyle: 'italic', color: 'grey' }}>Ultima atualização</span>,
        accessor: 'ts',
        Cell: ({ cell }) => {
          return (<span>{formatarDataHora(cell.value)}</span>)

        },
      }
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

  if (data.length === 0) {
    return (
      <div className='NoContent'>
        <img width={30} src="../src/images/Embeddo.png" alt="" />
        <h4>Sem alertas.</h4>
      </div>
    )
  }

  return (
    <table {...getTableProps()} id='cadTable'>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, index) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} style={{ height: '10px !important' }} /* onClick={() => onTableRowClick(lat, long)} */>
              {row.cells.map((cell, index) => {
                return (
                  <>
                    <td
                      {...cell.getCellProps()}
                      style={index === 1 ? { width: '40%' } : {}}
                    >
                      {cell.render('Cell')}
                    </td>
                  </>
                )
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default TableSider;
