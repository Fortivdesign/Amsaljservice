import { orderStatusLabel, type OrderStatus } from "@/data/account";

const styles: Record<OrderStatus, string> = {
  mottagen: "bg-info-50 text-info",
  packas: "bg-warning-50 text-warning",
  skickad: "bg-success-50 text-success",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {orderStatusLabel[status]}
    </span>
  );
}

const steps: OrderStatus[] = ["mottagen", "packas", "skickad"];

/** Liten tidslinje: Mottagen, Packas, Skickad */
export function OrderProgress({ status }: { status: OrderStatus }) {
  const current = steps.indexOf(status);
  return (
    <ol className="flex items-center gap-1.5" aria-label={`Status: ${orderStatusLabel[status]}`}>
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-1.5">
          <span className={`text-xs font-medium ${i <= current ? "text-ink" : "text-muted"}`}>{orderStatusLabel[s]}</span>
          {i < steps.length - 1 && <span className={`h-0.5 w-6 rounded-full sm:w-10 ${i < current ? "bg-success" : "bg-line"}`} />}
        </li>
      ))}
    </ol>
  );
}
