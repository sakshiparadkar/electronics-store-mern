import * as React from 'react';
import { Container, Typography, Grid, Paper, Stack, Chip, Avatar, Divider, Box } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';

const milestones = [
  {
    year: '2018',
    title: 'Launch',
    description: 'Started Fusion Electronics with a mission to curate gear that empowers creators and everyday innovators.',
  },
  {
    year: '2020',
    title: 'Global Warehouses',
    description: 'Opened regional fulfillment hubs in Austin, Berlin, and Singapore to ship faster than ever.',
  },
  {
    year: '2022',
    title: 'Creator Collective',
    description: 'Introduced our invite-only creator program to co-design exclusive bundles and gear edits.',
  },
  {
    year: '2025',
    title: '20k+ Members',
    description: 'Celebrated 50,000 VIP members and expanded our line to include modular smart home ecosystems.',
  },
];

const pillars = [
  {
    icon: <EmojiObjectsIcon fontSize="large" />,
    title: 'Quality Assured',
    description: 'Products that elevate your experience, guaranteed.'
  },
  {
    icon: <PrecisionManufacturingIcon fontSize="large" />,
    title: 'Responsible Tech',
    description: 'Thoughtful support and delightful interactions every time.'
  },
  {
    icon: <FavoriteBorderIcon fontSize="large" />,
    title: 'Customer Joy',
    description: 'Small touches that make big impressions.',
  },
  {
    icon: <RocketLaunchIcon fontSize="large" />,
    title: 'Future-Focused',
    description: 'Early adoption of emerging tech and exclusive drops.',
  },
];

function About() {
  return (
    <Container maxWidth="lg" sx={{ pb: 10 }}>
      <Stack spacing={3} sx={{ textAlign: 'center', mt: 6, mb: 6 }} alignItems="center">
        <Chip label="ABOUT SWASTIK" color="primary" variant="outlined" sx={{ alignSelf: 'center' }} />
        <Typography variant="h3" fontWeight={800}>
          Technology, Simplified & Tested
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 680, mx: 'auto', lineHeight: 1.9, textAlign: 'center' }}>
         Swastik Electronics selects, tests, and delivers the highest quality gadgets. Our mission is to make technology reliable, accessible, and inspiring for everyone.
        </Typography>
      </Stack>

      <Grid container spacing={4}>
        {pillars.map(pillar => (
          <Grid item xs={12} md={6} key={pillar.title}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, height: '100%' }}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>{pillar.icon}</Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {pillar.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {pillar.description}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Stack spacing={2} sx={{ mt: 8 }}>
        <Typography variant="h4" fontWeight={700}>
          Our Journey
        </Typography>
        <Typography variant="body1" color="text.secondary">
          From humble beginnings to a global community of builders, here’s how we’ve evolved.
        </Typography>
      </Stack>

      <Paper elevation={0} sx={{ mt: 3, p: { xs: 3, md: 5 }, borderRadius: 4 }}>
        <Grid container spacing={4} justifyContent="center">
          {milestones.map(step => (
            <Grid item xs={12} sm={6} key={step.year}>
              <Stack spacing={1.5}>
                <Chip label={step.year} color="primary" sx={{ alignSelf: 'flex-start' }} />
                <Typography variant="h6" fontWeight={700}>
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
}

export default About;
