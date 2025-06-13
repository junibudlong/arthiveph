// app/products/[productId]/page.tsx
export default function ProductPage({
  params,
}: {
  params: { productId: string };
}) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Product ID: {params.productId}</h1>
    </div>
  );
}

