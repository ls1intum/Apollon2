import React, { ReactNode } from "react"
import { Apollon2Provider, ModalProvider } from "@/contexts"

interface Props {
  children: ReactNode
}

export const AppProviders: React.FC<Props> = ({ children }) => {
  return (
    <Apollon2Provider>
      <ModalProvider>{children}</ModalProvider>
    </Apollon2Provider>
  )
}
