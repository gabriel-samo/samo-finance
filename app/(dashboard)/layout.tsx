import { Header } from "@/component/header";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="relative px-3 lg:px-14 z-10">{children}</main>
    </>
  );
};

export default DashboardLayout;
