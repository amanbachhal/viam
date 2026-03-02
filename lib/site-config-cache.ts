import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import SiteConfig from "@/models/site-config.model";
import { serialize } from "@/lib/serialize";

export const getCachedSiteConfig = unstable_cache(
  async () => {
    await connectDB();
    const config = await SiteConfig.findOne().lean();
    return serialize(config);
  },
  ["site-config"],
  {
    tags: ["site-config"],
  },
);
