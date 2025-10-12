type ValidationDetail = { loc: Array<string | number>; msg: string; type: string }

/**
 * Map a FastAPI/axios 422-style payload to react-hook-form errors.
 * Expects payload shape: { detail: [{ loc: [...], msg, type }, ...] }
 */
export function map422ToFormErrors(detail: any) {
    if (!detail || !Array.isArray(detail)) return {}
    const errors: Record<string, { type: string; message: string }[]> = {}
    for (const item of detail as ValidationDetail[]) {
        const loc = item.loc
        // assume last item in loc is the field name
        const field = String(loc[loc.length - 1])
        errors[field] = errors[field] || []
        errors[field].push({ type: item.type, message: item.msg })
    }
    return Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, { type: v[0].type, message: v[0].message }]))
}
