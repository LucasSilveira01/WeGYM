import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTable, useSortBy } from 'react-table';
import { PiVideoCameraFill, PiCameraFill } from 'react-icons/pi'
import moment from 'moment-timezone';

const TableGeral = ({ onTableRowClick, handleClickRow }) => {
  const [data, setData] = useState([]);
  const [sider, setSider] = useState([]);
  const [deteccao, setDeteccao] = useState([]);

  const { id } = useParams();

  function formatarDataHora(dataString) {
    const data = new Date(dataString);

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Os meses são indexados a partir de 0
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    const segundos = String(data.getSeconds()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
  }

  const sendTopic = (path, type) => {
    handleClickRow(path, type);
  }

  useEffect(() => {
    function update() {
      fetch('http://20.226.34.88:5000/get_alertas/' + id)
        .then(response => response.json())
        .then(data => {
          setSider(data.sider.map((item) => ({ ...item, subsistema: 'Sider' })));
          setDeteccao(data.deteccao.map((item) => ({ ...item, subsistema: 'Detecção' })));
        })
        .catch(err => console.error(err));
    }
    update();
    const interval = setInterval(update, 5000);
    return () => {
      clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    setData([...sider, ...deteccao].sort((a, b) => new Date(b.ts) - new Date(a.ts)));
  }, [sider, deteccao]);


  const columns = React.useMemo(
    () => [
      {
        Header: 'Subsistema',
        accessor: 'subsistema',
        Cell: ({ cell }) => {
          return (
            <button className={cell.value}>
              <span>{cell.value}</span>
            </button>
          )
        }
      }, {
        Header: 'Alerta',
        accessor: 'nivel',
        Cell: ({ cell }) => {
          const { nivel, tipo, certeza } = cell.row.original;
          let aux = certeza * 100;
          if (nivel === undefined || tipo === undefined) return (<span>{aux.toFixed(2)}%</span>);

          return (<span><strong>{'Nível ' + nivel}</strong>{': ' + tipo}</span>)
        }
      }, {
        Header: 'Latitude',
        accessor: 'lat',
      }, {
        Header: 'Longitude',
        accessor: 'longi',
      }, {
        Header: 'Video',
        accessor: 'file',
        Cell: ({ cell }) => {
          const { central, video } = cell.row.original;
          const value = cell.value;
          if (value === undefined) {
            return (
              <button style={{ visibility: 'hidden' }} onClick={() => sendTopic('Video', central)}>
                <span> <PiVideoCameraFill /> Gravar</span>
              </button>
            )
          } else {
            return (
              <button onClick={() => sendTopic({ value }, 'Video')}>
                <span> <PiVideoCameraFill />Vídeo</span>
              </button>
            )
          }
        }
      }, {
        Header: 'Foto',
        accessor: 'imagem',
        Cell: ({ cell }) => {
          const { central, video } = cell.row.original;
          const value = cell.value;
          if (value === undefined) {
            return (
              <button style={{ visibility: 'hidden' }} onClick={() => sendTopic('Foto', central)}>
                <span> <PiCameraFill /> Tirar</span>
              </button>
            )
          } else {
            return (
              <button onClick={() => sendTopic({ value }, 'Foto')}>
                <span> <PiCameraFill /> Foto</span>
              </button>
            )
          }
        }
      }, {
        Header: <span style={{ fontStyle: 'italic', color: 'grey' }}>Ultima atualização</span>,
        accessor: 'ts',
        Cell: ({ cell }) => {
          return (<span>{formatarDataHora(cell.value)}</span>)

        },
        sortType: 'datetime',
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
  } = useTable({ columns, data }, useSortBy);

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

export default TableGeral;
