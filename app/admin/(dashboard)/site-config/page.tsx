import SiteConfigForm from "@/components/admin/site-config-form";
import { getSiteConfig } from "@/actions/site-config.actions";

const page = async () => {
  const res = await getSiteConfig();
  const config = res?.data || null;

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)] bg-white p-6 rounded-xl border border-black/10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black">Website Config</h2>
      </div>

      <SiteConfigForm config={config} />
    </div>
  );
};

export default page;
