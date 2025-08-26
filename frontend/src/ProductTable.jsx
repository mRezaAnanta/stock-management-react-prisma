const products = [
  { id: 1, nama: 'Product A', sku: 'SKU001', price: 100, stock: 10 },
  { id: 2, nama: 'Product B', sku: 'SKU002', price: 150, stock: 5 },
  { id: 3, nama: 'Product C', sku: 'SKU003', price: 200, stock: 8 },
];

const ProductTable = () => {
  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Product Table</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Nama</th>
              <th className="py-2 px-4 border-b text-left">SKU</th>
              <th className="py-2 px-4 border-b text-left">Price</th>
              <th className="py-2 px-4 border-b text-left">Stock</th>
              <th className="py-2 px-4 border-b text-left">Total Value</th>
              <th className="py-2 px-4 border-b text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const totalValue = product.price * product.stock;
              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{product.nama}</td>
                  <td className="py-2 px-4 border-b">{product.sku}</td>
                  <td className="py-2 px-4 border-b">${product.price}</td>
                  <td className="py-2 px-4 border-b">{product.stock}</td>
                  <td className="py-2 px-4 border-b">${totalValue}</td>
                  <td className="py-2 px-4 border-b">
                    <button className="text-blue-600 hover:underline mr-2">Edit</button>
                    <button className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
