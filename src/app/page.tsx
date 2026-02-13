import { redirect } from "next/navigation";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";
import { redirectByRole } from "@/libs/utils";

export default async function RootPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    redirect(redirectByRole(user.role));
}
