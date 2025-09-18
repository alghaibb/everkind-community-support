import MobileNavClient from "./MobileNavClient";
import { getServerSession } from "@/lib/get-session";

export default async function MobileNav() {
  // Check session on server
  const session = await getServerSession();

  // Pass down whether to show staff login
  const showStaffLogin = !session?.user;

  return <MobileNavClient showStaffLogin={showStaffLogin} />;
}
