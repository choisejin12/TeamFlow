

const DataTable = ({ columns, data, renderAction }) => {
  return (
    <div className="w-full">

      {/* ✅ PC (table) */}
      <div className="hidden md:block">
        <table className="w-full text-sm text-left">
          
          <thead className="border-b text-gray-600">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="py-3">
                  {col.label}
                </th>
              ))}
              {renderAction && <th></th>}
            </tr>
          </thead>

          <tbody >
            {data.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                
                {columns.map((col) => (
                  <td key={col.key} className="py-3">
                    {col.render 
                      ? col.render(item[col.key], item) 
                      : item[col.key]}
                  </td>
                ))}

                {renderAction && (
                  <td>{renderAction(item)}</td>
                )}

              </tr>
            ))}
          </tbody>

        </table>
      </div>


      {/* ✅ 모바일 (카드 UI) */}
      <div className="md:hidden space-y-3">
        {data.map((item, idx) => (
          <div 
            key={idx}
            className="bg-white p-4 rounded-xl border"
          >

            {/* 액션 */}
            {renderAction && (
              <div className="flex justify-end mb-2">
                {renderAction(item)}
              </div>
            )}

            {/* 데이터 */}
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              {columns.map((col) => (
                <div key={col.key}>
                  <span className="text-gray-400 text-xs">
                    {col.label}
                  </span>
                  <div>
                    {col.render 
                      ? col.render(item[col.key], item) 
                      : item[col.key]}
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default DataTable;