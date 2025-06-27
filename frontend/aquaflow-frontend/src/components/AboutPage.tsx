import React from "react";
import { Container, Typography, Card, CardContent, Box } from "@mui/material";

const AboutPage: React.FC = () => (
  <Container
    maxWidth="md"
    sx={{
      mt: "var(--theme-spacing-xl, 2rem)",
      fontFamily: "var(--theme-font-family-sans, Inter, sans-serif)",
      color: "var(--theme-text-primary, #232b33)",
    }}
  >
    <Card
      elevation={4}
      sx={{
        background: "var(--theme-card, #fff)",
        borderRadius: "var(--theme-radius-xl, 0.75rem)",
        boxShadow: "var(--theme-box-shadow, 0 4px 24px 0 rgba(34,148,242,0.10))",
        border: "1px solid var(--theme-border, #e2e8f0)",
        p: { xs: 2, md: 4 },
        mb: "var(--theme-spacing-xl, 2rem)",
        transition: "var(--theme-transition, 0.3s ease-in-out)",
      }}
    >
      <CardContent>
        <Box textAlign="center" mb={3}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              color: "var(--theme-primary, #2294f2)",
              fontWeight: "var(--font-weight-bold, 700)",
              letterSpacing: 1,
              fontFamily: "var(--theme-font-family-sans, Inter, sans-serif)",
              fontSize: "var(--theme-font-size-4xl, 2.25rem)",
            }}
          >
            About AquaFlow Interactive
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "var(--theme-secondary, #007096)",
              mb: 2,
              fontStyle: "italic",
              fontFamily: "var(--theme-font-family-sans, Inter, sans-serif)",
              fontSize: "var(--theme-font-size-xl, 1.25rem)",
            }}
          >
            Simulate, visualize, and learn hydrology—instantly.
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{
            mb: 3,
            color: "var(--theme-text-secondary, #475569)",
            fontFamily: "var(--theme-font-family-sans, Inter, sans-serif)",
            fontSize: "var(--theme-font-size-lg, 1.125rem)",
          }}
        >
          <strong>AquaFlow Interactive</strong> is a web-based tool for exploring hydrological processes.
          Experiment with rainfall and watershed scenarios and see how rivers and streams respond in real-time.
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              color: "var(--theme-accent, #60a5fa)",
              fontWeight: "var(--font-weight-bold, 700)",
              fontFamily: "var(--theme-font-family-sans, Inter, sans-serif)",
              fontSize: "var(--theme-font-size-2xl, 1.5rem)",
              mb: 1,
            }}
            gutterBottom
          >
            🌊 Key Features
          </Typography>
          <ul
            style={{
              paddingLeft: "1.5rem",
              color: "var(--theme-text-primary, #232b33)",
              fontSize: "var(--theme-font-size-base, 1rem)",
              fontFamily: "var(--theme-font-family-sans, Inter, sans-serif)",
            }}
          >
            <li>Adjust rainfall and duration, instantly view the hydrograph</li>
            <li>Compare different hydrological models and scenarios</li>
            <li>Modern, interactive, mobile-friendly UI</li>
            <li>Export results and charts for reports</li>
          </ul>
        </Box>
        <Box>
          <Typography
            variant="body2"
            align="right"
            sx={{
              color: "var(--theme-text-muted, #64748b)",
              mt: 3,
              fontFamily: "var(--theme-font-family-mono, Fira Code, monospace)",
              fontSize: "var(--theme-font-size-sm, 0.875rem)",
            }}
          >
            &copy; {new Date().getFullYear()} AquaFlow Project. All rights reserved.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  </Container>
);

export default AboutPage;
