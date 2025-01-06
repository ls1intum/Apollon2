import { ClassNodeProps } from "@/nodes/classDiagram"
import { ClassType } from "@/types"
import { generateUUID } from "@/utils"
import { Delete } from "@mui/icons-material"
import { Box, Typography } from "@mui/material"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Popover from "@mui/material/Popover"
import TextField from "@mui/material/TextField"
import { useReactFlow } from "@xyflow/react"
import { useState } from "react"

interface PopoverComponentProps {
  id: string
  anchorEl: SVGSVGElement | null
  open: boolean
  onClose: () => void
  onNameChange: (newName: string) => void
}

export function ClassPopover({
  id,
  anchorEl,
  open,
  onClose,
  onNameChange,
}: PopoverComponentProps) {
  const [newAttribute, setNewAttribute] = useState("")
  const [newMethod, setNewMethod] = useState("")
  const reactFlow = useReactFlow()
  if (!anchorEl || !open) {
    return null
  }
  const nodeData = reactFlow.getNode(id)?.data as ClassNodeProps["data"]

  if (nodeData === undefined) {
    return null
  }

  const popoverId = open ? "simple-popover" : undefined
  const classStereoType = nodeData.stereotype

  const handleSteoTypeChange = (stereotype: ClassType) => {
    reactFlow.updateNodeData(id, {
      stereotype: classStereoType === stereotype ? undefined : stereotype,
    })
  }

  return (
    <Popover
      id={popoverId}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      style={{ margin: "0 8px", maxHeight: 500 }}
    >
      <Box
        sx={{
          p: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          bgcolor: "#F8F9FA",
        }}
      >
        <TextField
          id="outlined-basic"
          variant="outlined"
          onChange={(event) => onNameChange(event.target.value)}
          size="small"
          value={nodeData.name}
        />

        <div style={{ width: "100%", height: 1, background: "black" }} />

        <ButtonGroup aria-label="Basic button group" size="small">
          <Button
            variant={
              classStereoType === ClassType.Abstract ? "contained" : "outlined"
            }
            onClick={() => handleSteoTypeChange(ClassType.Abstract)}
          >
            Abstract
          </Button>
          <Button
            variant={
              classStereoType === ClassType.Interface ? "contained" : "outlined"
            }
            onClick={() => handleSteoTypeChange(ClassType.Interface)}
          >
            Interface
          </Button>
          <Button
            variant={
              classStereoType === ClassType.Enumeration
                ? "contained"
                : "outlined"
            }
            onClick={() => handleSteoTypeChange(ClassType.Enumeration)}
          >
            Enumeration
          </Button>
        </ButtonGroup>
        <div style={{ width: "100%", height: 1, background: "black" }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography variant="h6">Attributes</Typography>
          {nodeData.attributes.map((attribute) => (
            <Box
              key={attribute.id}
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TextField
                size="small"
                value={attribute.name}
                fullWidth
                onChange={(event) => {
                  const newAttributes = nodeData.attributes.map((attr) => {
                    if (attr.id === attribute.id) {
                      return {
                        ...attr,
                        name: event.target.value,
                      }
                    }
                    return attr
                  })
                  reactFlow.updateNodeData(id, { attributes: newAttributes })
                }}
              >
                {attribute.name}
              </TextField>
              <Delete
                sx={{ cursor: "pointer", width: 16, height: 16 }}
                onClick={() => {
                  const newAttributes = nodeData.attributes.filter(
                    (attr) => attr.id !== attribute.id
                  )
                  reactFlow.updateNodeData(id, { attributes: newAttributes })
                }}
              />
            </Box>
          ))}

          <TextField
            size="small"
            fullWidth
            sx={{ borderStyle: "dashed" }}
            value={newAttribute}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                const newAttributes = [
                  ...nodeData.attributes,
                  { id: generateUUID(), name: newAttribute },
                ]
                reactFlow.updateNodeData(id, { attributes: newAttributes })
                setNewAttribute("")
              }
            }}
            onChange={(event) => {
              setNewAttribute(event.target.value)
            }}
          />
        </Box>
        <div style={{ width: "100%", height: 1, background: "black" }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography variant="h6">Methods</Typography>
          {nodeData.methods.map((method) => (
            <Box
              key={method.id}
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TextField
                size="small"
                value={method.name}
                fullWidth
                onChange={(event) => {
                  const newMethods = nodeData.methods.map((meth) => {
                    if (meth.id === method.id) {
                      return {
                        ...meth,
                        name: event.target.value,
                      }
                    }
                    return meth
                  })
                  reactFlow.updateNodeData(id, { methods: newMethods })
                }}
              >
                {method.name}
              </TextField>
              <Delete
                sx={{ cursor: "pointer", width: 16, height: 16 }}
                onClick={() => {
                  const newMethods = nodeData.methods.filter(
                    (meth) => meth.id !== method.id
                  )
                  reactFlow.updateNodeData(id, { methods: newMethods })
                }}
              />
            </Box>
          ))}
          <TextField
            size="small"
            fullWidth
            sx={{ borderStyle: "dashed" }}
            value={newMethod}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                const newMethods = [
                  ...nodeData.methods,
                  { id: generateUUID(), name: newMethod },
                ]
                reactFlow.updateNodeData(id, { methods: newMethods })
                setNewMethod("")
              }
            }}
            onChange={(event) => {
              setNewMethod(event.target.value)
            }}
          />
        </Box>
      </Box>
    </Popover>
  )
}
