import { Box, Container, Typography, Link, Grid, Divider } from '@mui/material';
import { AirplanemodeActive } from '@mui/icons-material';

const footerSections = [
  {
    title: 'Company',
    links: ['About Us', 'Careers', 'Press', 'Affiliates'],
  },
  {
    title: 'Support',
    links: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'],
  },
  {
    title: 'Explore',
    links: ['Deals', 'Destinations', 'Airlines', 'Travel Guides'],
  },
];

export function Footer() {
  return (
    <Box
      sx={{
        bgcolor: '#0F172A', // Dark blue, similar to Skyscanner
        color: '#94A3B8', // Light text color
        py: 6,
        borderTop: '1px solid #1E293B',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid
            item
            xs={12}
            md={4}
            sx={{ display: 'flex', flexDirection: 'column' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AirplanemodeActive
                sx={{ color: '#38BDF8', fontSize: 28, mr: 1 }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: '#FFFFFF' }}
              >
                SkyBook
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ maxWidth: 300 }}>
              Your ultimate travel companion. Find and book cheap flights with
              ease.
            </Typography>
          </Grid>
          {footerSections.map((section) => (
            <Grid item xs={6} sm={4} md={2} key={section.title}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: '#FFFFFF', mb: 2 }}
              >
                {section.title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {section.links.map((link) => (
                  <Link
                    href="#"
                    key={link}
                    sx={{
                      color: '#94A3B8',
                      textDecoration: 'none',
                      '&:hover': {
                        color: '#FFFFFF',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {link}
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ borderColor: '#1E293B', my: 4 }} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} SkyBook. All rights reserved.
          </Typography>
          <Typography variant="body2">A Vamsi Krishna Project</Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
