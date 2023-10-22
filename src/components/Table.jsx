import React, { useEffect, useState, useCallback } from 'react';
import { useTable } from 'react-table';

const Table = ({ setMeasure }) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        const id = localStorage.getItem('id');
        const apiUrl = 'http://localhost:5000/get_measures/' + id;
        function update() {
            fetch(apiUrl).then(response => response.json())
                .then(data => setData(data))
                .catch(err => console.error(err));
        }
        update();
        const interval = setInterval(update, 5000);
        return () => {
            clearInterval(interval);
        }
    }, []);

    const handleOnClick = useCallback((id) => {
        setMeasure(id);
    }, [setMeasure]);

    function formatarData(dataISO) {
        const data = new Date(dataISO);
        const dia = data.getDate().toString().padStart(2, '0');
        const mes = (data.getMonth() + 1).toString().padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }

    const columns = React.useMemo(
        () => [
            {
                Header: 'Data e Hora',
                accessor: 'measureDate',
                Cell: ({ value }) => {
                    const dataFormatada = formatarData(value);
                    return (
                        <span>{dataFormatada}</span>
                    );
                }
            }, {
                Header: 'Peso',
                accessor: 'weight',
                Cell: ({ value }) => {
                    return (
                        <span>{value} kg</span>
                    )
                }
            }, {
                Header: 'Bodyfat',
                accessor: 'percentage',
                Cell: ({ value }) => {
                    return (
                        <span>{value} %</span>
                    )
                }
            }, {
                Header: 'Action',
                accessor: 'ts',
                Cell: ({ row }) => {
                    const { ID } = row.original;
                    return (
                        <div className='action'>
                            <a onClick={() => handleOnClick(ID)}>Visualizar</a>
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

    if (data.length === 0) {
        return (
            <>
                <div className="logo" style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                    <img style={{ margin: 10 }} src="../src/assets/images/Logo.png" alt="" width={50} height={20} />
                    <h4 style={{ margin: 0 }}>FitTracker</h4>
                    <span style={{ color: '#fffff294', marginTop: 20 }}>Ainda não existe medições, que tal adicionar uma agora mesmo?</span>
                </div>
            </>
        )
    }

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

export default Table;
