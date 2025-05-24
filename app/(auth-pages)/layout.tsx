import Header from "@/components/auth-pages/header";
import { cn } from "@/lib/utils";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex flex-col items-center px-32"
      )}>
      <Header />
      {children}
    </div>
  );
}
