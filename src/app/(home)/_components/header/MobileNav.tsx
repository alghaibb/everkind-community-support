import MobileNavClient from "./MobileNavClient";
import { getServerSession } from "@/lib/get-session";

export default async function MobileNav() {
  const session = await getServerSession();
  const user = session?.user;

  const userForDropdown = user
    ? {
        ...user,
        role: user.role || undefined,
      }
    : undefined;

  return <MobileNavClient user={userForDropdown} />;
}
