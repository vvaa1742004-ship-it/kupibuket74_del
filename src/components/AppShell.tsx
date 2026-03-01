import { Box, CircularProgress, Container, Stack, Typography } from "@mui/material";
import type { PropsWithChildren } from "react";

interface AppShellProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  loading?: boolean;
}

export default function AppShell({ title, subtitle, loading, children }: AppShellProps) {
  return (
    <Box className="app-bg">
      <Container maxWidth="sm" sx={{ py: 2.5 }}>
        <Stack spacing={2}>
          <Box className="hero">
            <Typography variant="h5">{title}</Typography>
            {subtitle ? <Typography color="text.secondary">{subtitle}</Typography> : null}
          </Box>
          {loading ? (
            <Box sx={{ display: "grid", placeItems: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            children
          )}
        </Stack>
      </Container>
    </Box>
  );
}

