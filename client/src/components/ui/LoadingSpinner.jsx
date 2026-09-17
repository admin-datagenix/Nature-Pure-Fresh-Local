export default function LoadingSpinner() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-label="Loading">
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#e8e4df] border-t-primary" />
    </div>
  );
}
