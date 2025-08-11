import CDATributo from "@/components/CDATributo";
import Inscricoes from "@/components/Inscricoes";
import Montante from "@/components/Montante";
import Quantidade from "@/components/Quantidade";
import Saldo from "@/components/Saldo";

type Props = {
  className?: string;
};

function Dashboard({ className }: Props) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4  ${
        className || ""
      }`}
    >
      <Inscricoes className="col-span-1 sm:col-span-2 md:col-span-1" />
      <Quantidade className="col-span-1 sm:col-span-2 md:col-span-1 h-full" />
      <CDATributo className="col-span-1 md:col-span-1 lg:col-start-2 lg:col-span-2 lg:row-start-1 lg:row-end-3" />
      {/*className="col-span-1 md:col-span-1 lg:col-start-2 lg:col-span-2 lg:row-start-1 lg:row-end-3"*/}

      <Saldo className="col-span-1 sm:col-span-2 md:col-span-1" />
      <Montante className="col-span-1 sm:col-span-2 md:col-span-1" />
    </div>
  );
}

export default Dashboard;
