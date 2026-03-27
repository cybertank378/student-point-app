//Files: src/modules/student/presentation/builders/buildUpdateStudentPayload.ts

import {buildDynamicPatch} from "@/modules/shared/utils/buildDynamicPatch";
import {StudentFormType} from "@/modules/student/domain/types/StudentFormType";


export function buildStudentUpdatePayload(
    id: string,
    form: StudentFormType,
    original: StudentFormType
) {

    /**
     * =====================================================
     * REMOVE READ-ONLY FIELDS
     * =====================================================
     */

    const sanitize = (data: StudentFormType) => {

        const {
            //enrollment,
            //pointSummary,
            ...rest
        } = data;

        return rest;
    };

    const sanitizedForm = sanitize(form);
    const sanitizedOriginal = sanitize(original);

    return buildDynamicPatch(
        id,
        sanitizedForm,
        sanitizedOriginal,
        [
            /**
             * Difable dependency
             */
            {
                when: (form, original) =>
                    form.isDifable !== original.isDifable,

                setNull: ["difableNotes"]
            }
        ]
    );
}