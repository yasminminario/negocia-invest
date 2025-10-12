import * as React from "react"

import type { ToastProps } from "@radix-ui/react-toast"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 10_000

const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
} as const

type ToastActionTypes = typeof actionTypes

interface Toast extends Omit<ToastProps, "title" | "description" | "action"> {
    id: string
    title?: React.ReactNode
    description?: React.ReactNode
    action?: React.ReactNode
}

type ToastState = {
    toasts: Toast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
    if (toastTimeouts.has(toastId)) {
        return
    }

    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId)
        dispatch({
            type: "REMOVE_TOAST",
            toastId,
        })
    }, TOAST_REMOVE_DELAY)

    toastTimeouts.set(toastId, timeout)
}

const reducer = (state: ToastState, action: ToastAction): ToastState => {
    switch (action.type) {
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            }

        case "UPDATE_TOAST":
            return {
                ...state,
                toasts: state.toasts.map((toast) =>
                    toast.id === action.toast.id ? { ...toast, ...action.toast } : toast
                ),
            }

        case "DISMISS_TOAST": {
            const { toastId } = action

            if (!toastId) {
                state.toasts.forEach((toast) => {
                    addToRemoveQueue(toast.id)
                })
                return {
                    ...state,
                    toasts: state.toasts.map((toast) => ({ ...toast, open: false })),
                }
            }

            addToRemoveQueue(toastId)

            return {
                ...state,
                toasts: state.toasts.map((toast) =>
                    toast.id === action.toastId ? { ...toast, open: false } : toast
                ),
            }
        }

        case "REMOVE_TOAST":
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: [],
                }
            }
            return {
                ...state,
                toasts: state.toasts.filter((toast) => toast.id !== action.toastId),
            }
    }
}

type ToastAction =
    | { type: ToastActionTypes["ADD_TOAST"]; toast: Toast }
    | { type: ToastActionTypes["UPDATE_TOAST"]; toast: Partial<Toast> & { id: string } }
    | { type: ToastActionTypes["DISMISS_TOAST"]; toastId?: string }
    | { type: ToastActionTypes["REMOVE_TOAST"]; toastId?: string }

const listeners: Array<(state: ToastState) => void> = []

let memoryState: ToastState = { toasts: [] }

function dispatch(action: ToastAction) {
    memoryState = reducer(memoryState, action)
    listeners.forEach((listener) => {
        listener(memoryState)
    })
}

export function toast({ ...props }: Omit<Toast, "id">) {
    const id = generateId()

    const update = (props: Toast) =>
        dispatch({
            type: "UPDATE_TOAST",
            toast: { ...props, id },
        })
    const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

    dispatch({
        type: "ADD_TOAST",
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open) => {
                if (!open) dismiss()
            },
        },
    })

    return {
        id,
        dismiss,
        update,
    }
}

export function useToast() {
    const [state, setState] = React.useState<ToastState>(memoryState)

    React.useEffect(() => {
        listeners.push(setState)
        return () => {
            const index = listeners.indexOf(setState)
            if (index > -1) {
                listeners.splice(index, 1)
            }
        }
    }, [state])

    return {
        ...state,
        toast,
        dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
    }
}

function generateId() {
    return Math.random().toString(36).slice(2, 10)
}
