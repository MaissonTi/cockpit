"use client"

import * as React from "react";

const ALERT_LIMIT = 1
const ALERT_REMOVE_DELAY = 1000000

export type TypeAction = "confirm" | "cancel";

export interface AlertDialogGeneralProps {
  open?: boolean;
  title: string;
  description?: string;
  isAsync?: boolean
  onOpenChange?: (open: boolean) => void;
  callback?: (typeAction: TypeAction) => void;
}

type AlertDialogGeneralType = AlertDialogGeneralProps & {
  id: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actionTypes = {
  ADD_ALERT: "ADD_ALERT",
  UPDATE_ALERT: "UPDATE_ALERT",
  DISMISS_ALERT: "DISMISS_ALERT",
  REMOVE_ALERT: "REMOVE_ALERT",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_ALERT"]
      alert: AlertDialogGeneralType
    }
  | {
      type: ActionType["UPDATE_ALERT"]
      alert: Partial<AlertDialogGeneralType>
    }
  | {
      type: ActionType["DISMISS_ALERT"]
      alertId?: AlertDialogGeneralType["id"]
    }
  | {
      type: ActionType["REMOVE_ALERT"]
      alertId?: AlertDialogGeneralType["id"]
    }

interface State {
  alerts: AlertDialogGeneralType[]
}

const alertTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (alertId: string) => {
  if (alertTimeouts.has(alertId)) {
    return
  }

  const timeout = setTimeout(() => {
    alertTimeouts.delete(alertId)
    dispatch({
      type: "REMOVE_ALERT",
      alertId: alertId,
    })
  }, ALERT_REMOVE_DELAY)

  alertTimeouts.set(alertId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_ALERT":
      return {
        ...state,
        alerts: [action.alert, ...state.alerts].slice(0, ALERT_LIMIT),
      }

    case "UPDATE_ALERT":
      return {
        ...state,
        alerts: state.alerts.map((t) =>
          t.id === action.alert.id ? { ...t, ...action.alert } : t
        ),
      }

    case "DISMISS_ALERT": {
      const { alertId } = action

      // ! Side effects ! - This could be extracted into a dismissAlert() action,
      // but I'll keep it here for simplicity
      if (alertId) {
        addToRemoveQueue(alertId)
      } else {
        state.alerts.forEach((alert) => {
          addToRemoveQueue(alert.id)
        })
      }

      return {
        ...state,
        alerts: state.alerts.map((t) =>
          t.id === alertId || alertId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_ALERT":
      if (action.alertId === undefined) {
        return {
          ...state,
          alerts: [],
        }
      }
      return {
        ...state,
        alerts: state.alerts.filter((t) => t.id !== action.alertId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { alerts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Props = Omit<AlertDialogGeneralType, "id">

function alertDialog({ ...props }: Props) {
  const id = genId()

  const isAsync = props.isAsync ?? false

  const update = (props: AlertDialogGeneralType) =>
    dispatch({
      type: "UPDATE_ALERT",
      alert: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_ALERT", alertId: id })

  dispatch({
    type: "ADD_ALERT",
    alert: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if(isAsync) return
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useListAlert() {
  const [state, setState] = React.useState<State>(memoryState)

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
    ...state
  }
}

function useAlertDialog() {
  return {
    alertDialog,
    dismiss: (alertId?: string) => dispatch({ type: "DISMISS_ALERT", alertId }),
  }
}

export { alertDialog, useAlertDialog, useListAlert };

