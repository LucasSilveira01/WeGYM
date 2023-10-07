import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import { TbCircleCheckFilled, TbCircleXFilled, TbFaceId } from 'react-icons/tb'
import { PiVideoCameraFill, PiCameraFill } from 'react-icons/pi'
import { IoIosPerson } from 'react-icons/io'
import { useMap, Marker, Popup } from 'react-leaflet'

const Table = ({ onTableRowClick, handleClickRow }) => {
  const [data, setData] = useState([]);
  /* const setMapView = (position) => {
    const map = localStorage.getItem('map');
    map.panTo(position);
    map.setZoom(15)
  } */

  const sendTopic = async (path, central) => {
    handleClickRow(path, central);
  }

  useEffect(() => {
    function update() {
      fetch('http://20.226.34.88:5000/get_caminhao')
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
        Header: 'Placa',
        accessor: 'placa',
        Cell: ({ row }) => {
          const { id, placa } = row.original;
          return (
            <>
              <a style={{ color: '#e9e9e9', textDecoration: 'none', fontWeight: 'bolder' }} href={'/trip/' + id}>{placa}</a>
            </>
          )
        }
      }, {
        Header: 'Motorista',
        accessor: 'motorista',
        Cell: ({ cell }) => {
          const { motorista, ultima_att, status } = cell.row.original;
          /* 
            Vermelho: Se o motorista detectado não estiver registrado no banco de dados.
            Verde: Se o motorista detectado estiver registrado no banco de dados.
            Laranja: Se não houver motorista identificado no caminhão.
          */
          if (status === 0) {
            return (
              <span>
                <span className="tooltip-container"><i style={{ color: '#FA1D1D' }}><IoIosPerson /><span className="tooltip-text">{ultima_att}</span></i></span>
                {motorista}
              </span>
            )
          } else if (status === 1) {
            return (
              <span>
                <span className="tooltip-container"><i style={{ color: '#5ae94e' }}><IoIosPerson /><span className="tooltip-text">{ultima_att}</span></i></span>
                {motorista}
              </span>
            )
          }

          return (
            <span>
              <span className="tooltip-container"><i style={{ color: '#c1c1c1' }}><IoIosPerson /><span className="tooltip-text">{ultima_att}</span></i></span>
              {motorista}
            </span>
          )

        }
      }, {
        Header: 'Status Sider',
        accessor: 'sider',
        Cell: ({ value }) => {
          if (value == 1) return <i style={{ color: '#5AE94E' }}><TbCircleCheckFilled /></i>
          else return <i style={{ color: '#FA1D1D' }}><TbCircleXFilled /></i>
        }
      }, {
        Header: 'Status Detecção',
        accessor: 'reconhecimento',
        Cell: ({ value }) => {
          if (value == 1) return <i style={{ color: '#5AE94E' }}><TbCircleCheckFilled /></i>
          else return <i style={{ color: '#FA1D1D' }}><TbCircleXFilled /></i>
        }
      }, {
        Header: 'Vídeo',
        accessor: 'video',
        Cell: ({ cell }) => {
          const { central, video } = cell.row.original;
          if (video === undefined) {
            return (
              <button onClick={() => sendTopic(`/c/${central}/newVideo`, central)}>
                <span> <PiVideoCameraFill /> Gravar</span>
              </button>
            )
          }
        }
      }, {
        Header: 'Foto',
        accessor: 'foto',
        Cell: ({ cell }) => {
          const { central, video } = cell.row.original;
          return (
            <button onClick={() => sendTopic(`/c/${central}/newPhoto`, central)}>
              <span> <PiCameraFill /> Tirar</span>
            </button>
          )
        }
      }, {
        Header: <span >Latitude</span>,
        accessor: 'lat',
        show: false
      }, {
        Header: <span >Longitude</span>,
        accessor: 'longi',
        show: false
      }, {
        Header: 'Última localização',
        accessor: 'endereco',
      }, {
        Header: <span style={{ fontStyle: 'italic', color: 'grey' }}>Ultima atualização</span>,
        accessor: 'att'
      }
    ],
    []
  );
  const handleTrClick = (lat, long) => {
    console.log('LATITUDE: ', lat, long);


  }
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  if (data.length < 0) return (<>Carregando</>)

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
          const lat = row.values.lat;
          const long = row.values.longi;

          return (
            <tr {...row.getRowProps()} style={{ height: '30px' }} onClick={() => onTableRowClick(lat, long)}>
              {row.cells.map((cell, index) => {
                return (
                  <>
                    <td {...cell.getCellProps()}>
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

export default Table;
