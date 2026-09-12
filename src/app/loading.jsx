import LoadingSpinner from "@/components/LoadingSpinner";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner text="Connecting to DriveFleet live fleet..." />
    </div>
  );
}
