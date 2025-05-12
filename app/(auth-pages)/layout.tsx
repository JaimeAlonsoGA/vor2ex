import { cn, MAX_WIDTH_SIZE } from "@/lib/utils";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex flex-col gap-12 items-start ",
        MAX_WIDTH_SIZE
      )}
    >
      {children}
    </div>
  );
}
