import { Box, Typography } from "../ui"
import { secondary, appVersion } from "@/constants"

export const BrandAndVersion = () => {
  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h5"
        style={{
          marginRight: 16,
          flexGrow: 1,
          fontWeight: 700,
        }}
      >
        Apollon2
      </Typography>
      <Typography variant="body2" style={{ color: secondary }}>
        {appVersion}
      </Typography>
    </Box>
  )
}
