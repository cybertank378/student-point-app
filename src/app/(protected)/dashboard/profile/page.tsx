//Files: src/app/(protected)/dashboard/profile/page.tsx

import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";
import StudentProfileSection from "@/sections/student/pages/StudentProfileSection";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return <h1>User not found</h1>;
  }
  return <StudentProfileSection username={user.username} />;
}
