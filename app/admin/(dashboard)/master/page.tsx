import MasterForm from "@/components/admin/master-form";
import { getMasterConfig } from "@/actions/master.actions";

const page = async () => {
  const res = await getMasterConfig();
  const config = res?.data || null;

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)] bg-white p-6 rounded-xl border border-black/10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black">
          Master Configuration
        </h2>
      </div>

      <MasterForm initialData={config} />
    </div>
  );
};

export default page;
