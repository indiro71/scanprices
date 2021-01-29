import React from 'react';

export const Table = ({headings, tableBody}) => {
    return (
        <table className="highlight responsive-table">
            <thead>
                <tr>
                    {headings.map((head, index) => <th key={index}>{head}</th>)}
                </tr>
            </thead>

            <tbody>
            {tableBody.map((tableRow, index) => {
                return (
                    <tr key={index}>
                        {tableRow.map((rowItem, index) => <td key={index}>{rowItem}</td>)}
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
}