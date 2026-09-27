export default function StatusBadge({ value }) {
  return (
    <span className="badge text-bg-secondary">
      {value?.replaceAll("_", " ")}
    </span>
  );
}
