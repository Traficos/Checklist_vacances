"use client";

interface ToastProps {
  toasts: { id: number; message: string; type: "success" | "error" }[];
}

export function ToastContainer({ toasts }: ToastProps) {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium animate-slide-up ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
