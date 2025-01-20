import Box from "@mui/material/Box/Box"
import Typography from "@mui/material/Typography/Typography"
import { secondary } from "../../constants"

export const BrandAndVersion = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h5"
        noWrap
        sx={{
          mr: 2,
          flexGrow: 1,
          fontWeight: 700,
        }}
      >
        Apollon2
      </Typography>
      <Typography variant="body2" sx={{ color: secondary }}>
        v0.0.1
      </Typography>
    </Box>
  )
}
