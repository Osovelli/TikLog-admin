import React, { useState, useMemo } from 'react';
import { Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { PasscodeLock } from '@/icon/PasscodeLock';

export const Table = ({ 
  data = [], 
  columns = [],
  name,
  renderCustomCell,
  renderActions,
  onRowClick,
  onDeleteClick,
  itemsPerPage = 10,
  className = '',
  showSearch = true,
  showDelete = false,
  showManage=false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  console.log('Table component rendered with data:', data, 'and columns:', columns);

  const filteredData = useMemo(() => {
    return data.filter(item => 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: 
        prevConfig.key === key && prevConfig.direction === 'asc' 
          ? 'desc' 
          : 'asc',
    }));
  };

  const getStatusStyle = (status) => {
    const baseStyle = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status?.toLowerCase()) {
      case 'delivered':
        return `${baseStyle} bg-green-100 text-green-800`;
      case 'cancelled':
        return `${baseStyle} bg-red-100 text-red-800`;
      case 'ongoing':
        return `${baseStyle} bg-orange-100 text-orange-800`;
      case 'active': 
        return `${baseStyle} bg-green-100 text-green-900`;
      case 'inactive': 
        return `${baseStyle} bg-red-100 text-red-600`;
      default:
        return baseStyle;
    }
  };

  const renderPagination = () => (
    <div className="flex items-center justify-between mt-4">
      <span className="text-sm text-gray-700">
        Total {name || "Users"}: <span className="font-medium">{sortedData.length}</span>
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-1 rounded-md disabled:opacity-50"
        >
          <ChevronLeft size={20} />
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`w-8 h-8 flex items-center justify-center rounded-md ${
              currentPage === index + 1
                ? 'bg-[#E2E4E9] text-gray-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {index + 1}
          </button>
        )).slice(0, 3)}
        {totalPages > 3 && <span className="px-2">...</span>}
        {totalPages > 3 && (
          <button
            onClick={() => setCurrentPage(totalPages)}
            className={`w-8 h-8 flex items-center justify-center rounded-md ${
              currentPage === totalPages
                ? 'bg-indigo-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {totalPages}
          </button>
        )}
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-1 rounded-md disabled:opacity-50"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {showSearch && 
        <div className="flex justify-between items-center">
          <div className="relative w-full md:w-[500px]">
            <input
              type="text"
              placeholder="Search items"
              className="w-full bg-white pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      }
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {sortConfig.key === column.key && (
                      <span className="text-gray-400">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                {/* Actions */}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {!renderCustomCell && column.key === 'status' ? (
                      <span className={getStatusStyle(item[column.key])}>
                        {item[column.key]}
                      </span>
                    ) : column.key === 'fee' ? (
                      <span className="text-blue-600 font-medium">
                        N {item[column.key]}
                      </span>
                    ) : column.key === 'amount' ? (
                      <span className="text-green-600 font-medium">
                        N {item[column.key]}
                      </span>
                    ) : renderCustomCell ? (     
                      renderCustomCell(column.key, item[column.key], item)
                    ) : (
                      item[column.key]
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {renderActions ? renderActions(item) : (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onRowClick?.(item)}
                        className="text-blue-600 hover:text-blue-900 w-full flex items-center justify-center bg-white"
                      >
                        <Eye size={16} />
                      </button>
                      {/* {showManage && (
                        <button
                          onClick={() => onPassClick?.(item)}
                          className="text-blue-600 hover:text-blue-900 w-full flex items-center justify-center bg-white"
                        >
                          <PasscodeLock size={18} color={'#23AA26'} />
                        </button>
                      )}
                      {showDelete && (
                        <button 
                          onClick={() => onDeleteClick?.(item)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <Trash2 size={16} />
                        </button>
                      )} */}
                    </div>
                  )}
                  {/* <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onRowClick?.(item)}
                      className="text-blue-600 hover:text-blue-900 w-full flex items-center justify-center bg-white"
                    >
                      <Eye size={16} />
                    </button>
                    {showManage && (
                    <button
                      onClick={() => onPAssClick?.(item)}
                      className="text-blue-600 hover:text-blue-900 w-full flex items-center justify-center bg-white"
                    >
                      <PasscodeLock size={18} color={'#23AA26'} />
                    </button>
                    )}
                    {showDelete && (
                      <button 
                        onClick={() => onDeleteClick?.(item)}
                        className="text-red-600 hover:text-red-900 flex items-center"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {renderPagination()}
    </div>
  );
};