//Files: src/shared-ui/component/toastHandler.ts

import { showErrorToast } from "@/shared-ui/component/Toast";
import type { ApiError } from "@/modules/shared/errors/ApiError";
import { getErrorMessage } from "@/modules/shared/errors/errorUtils";

export const handleApiErrorToast = (
    error?: ApiError | null
) => {
    const message = getErrorMessage(error);
    showErrorToast(message);
};