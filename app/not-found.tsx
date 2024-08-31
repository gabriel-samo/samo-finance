export const runtime = "edge";

export default async function NotFound() {
  return (
    <div className="flex items-center justify-center gap-4 min-h-screen bg-black text-white">
      <h1 className="text-4xl font-bold border-r-4 border-white pr-4">404</h1>
      <p className="text-lg">Not Found</p>
    </div>
  );
}
