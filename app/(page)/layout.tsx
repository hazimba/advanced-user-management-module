import Footer from "@/components/Footers";
import Header from "@/components/Headers";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen justify-between flex-col pt-1">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};
export default PageLayout;
