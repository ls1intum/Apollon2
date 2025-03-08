import React, { ReactNode } from "react"
import { Apollon2Provider, ModalProvider } from "@/contexts"

interface Props {
  children: ReactNode
}

export const AppProviders: React.FC<Props> = ({ children }) => {
  return (
    <ModalProvider>
      <Apollon2Provider>{children}</Apollon2Provider>
    </ModalProvider>
  )
}
