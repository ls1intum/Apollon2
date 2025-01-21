import React, { ReactNode } from "react"
import { Apollon2Provider } from "@/contexts/Apollon2Context"
import { ModalProvider } from "@/contexts/ModalContext"

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
