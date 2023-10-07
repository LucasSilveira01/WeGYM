import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import { useParams } from 'react-router-dom';
import { PiVideoCameraFill, PiCameraFill } from 'react-icons/pi'
import moment from 'moment-timezone';

const TableDetection = ({ onTableRowClick, handleClickRow }) => {
  const [data, setData] = useState([]);
  const { id } = useParams();

  const sendTopic = async (path, type) => {
    handleClickRow(path, type);
  }
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
  useEffect(() => {
    function update() {
      fetch('http://20.226.34.88:5000/get_et03/' + id)
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa em 0 (janeiro é 0)
    const year = String(date.getFullYear());

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };



  const columns = React.useMemo(
    () => [
      {
        Header: 'Subsistema',
        accessor: 'subsistema',
        Cell: ({ cell }) => {
          return (
            <button className={'Detecção'}>
              <span>{'Detecção'}</span>
            </button>
          )
        }
      }, {
        Header: 'Alerta', // Mensagem do subsistema
        accessor: 'nivel',
        Cell: ({ cell }) => {
          const { nivel, tipo } = cell.row.original;

          return (<span><strong>{'Nível ' + nivel}</strong>{': ' + tipo}</span>)
        }
      }, {
        Header: 'Latitude', // Mensagem do subsistema
        accessor: 'lat',
      }, {
        Header: 'Longitude', // Mensagem do subsistema
        accessor: 'longi',
      }, {
        Header: 'Video',
        accessor: 'file',
        Cell: ({ cell }) => {
          const { central, video } = cell.row.original;
          const value = cell.value;
          if (value === '') {
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
          if (value === '') {
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
                      style={index === 1 ? { width: '15%' } : {}}
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

export default TableDetection;
