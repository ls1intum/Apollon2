import { create, StoreApi, UseBoundStore } from "zustand"
import { devtools } from "zustand/middleware"

export type PopoverStore = {
  popoverElementId: string | null
  setPopOverElementId: (value: string | null) => void
  reset: () => void
}

type InitialPopoverState = {
  popoverElementId: string | null
}
const initialPopoverState: InitialPopoverState = {
  popoverElementId: null,
}

export const createPopoverStore = (): UseBoundStore<StoreApi<PopoverStore>> =>
  create<PopoverStore>()(
    devtools(
      (set) => ({
        ...initialPopoverState,

        setPopOverElementId: (value: string | null) => {
          set({ popoverElementId: value }, undefined, "setPopOverElementId")
        },

        reset: () => {
          set(initialPopoverState, undefined, "reset")
        },
      }),
      { name: "PopoverStore", enabled: true }
    )
  )
