import React from 'react';

export const Table = ({headings, tableBody}) => {
    return (
        <table className="highlight responsive-table">
            <thead>
            <tr>
            {headings.map(head => <th>{head}</th>)}
            </tr>
            </thead>

            <tbody>
            {tableBody.map(tableRow => {
                return (
                    <tr>
                        {tableRow.map(rowItem => <td>{rowItem}</td>)}
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
}