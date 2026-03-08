import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [query, setQuery] = useState('SELECT * FROM Brands');
  const [results, setResults] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunQuery = async () => {
    if (!query.trim()) {
      toast.warning('Vui lòng nhập câu truy vấn SQL!');
      return;
    }

    setIsLoading(true);
    setResults([]);
    setColumns([]);

    try {
      const response = await axios.post('http://localhost:3000/query', { query: query.trim() });
      const data = response.data;

      toast.success('Biên dịch truy vấn thành công!');

      if (data && data.length > 0) {
        setResults(data);
        setColumns(Object.keys(data[0]));
      } else {
        toast.info('Truy vấn chạy thành công nhưng không có dữ liệu trả về.');
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi chạy truy vấn';
      toast.error(`Lỗi: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Trình thực thi SQL Query</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex bg-gray-100 px-4 py-2 border-b border-gray-200">
            <span className="text-gray-500 font-mono text-sm leading-6 pr-4 border-r border-gray-300">1</span>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent focus:outline-none focus:ring-0 font-mono text-sm text-blue-700 pl-4 resize-y min-h-[150px]"
              spellCheck={false}
            />
          </div>
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-start">
            <button
              onClick={handleRunQuery}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded text-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? 'Đang chạy...' : 'Chạy câu Truy vấn'}
            </button>
          </div>
        </div>

        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div className="flex items-center text-green-600 font-medium text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                Biên dịch truy vấn thành công!
              </div>
              <div className="text-gray-500 text-sm">
                {results.length} rows
              </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((col, idx) => (
                    <th key={idx} scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 last:border-r-0">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-gray-50">
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-r border-gray-200 last:border-r-0">
                        {row[col] !== null && row[col] !== undefined ? String(row[col]) : <span className="text-gray-400 italic">null</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
