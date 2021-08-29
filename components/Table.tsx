import React, { FC } from 'react';

interface TableProps {
  headings: React.ReactNode[];
  tableBody: React.ReactNode[][];
}

export const Table: FC<TableProps> = ({ headings, tableBody }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200 my-2">
      <thead className="bg-gray-50">
        <tr>
          {headings.map((head, index) => (
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              key={index}
            >
              {head}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {tableBody &&
          tableBody.map((tableRow, index) => {
            return (
              <tr key={index}>
                {tableRow.map((rowItem, index) => (
                  <td className="px-6 py-4 whitespace-nowrap" key={index}>
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {rowItem}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};
