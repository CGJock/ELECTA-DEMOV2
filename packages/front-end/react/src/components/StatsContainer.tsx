'use client'
import * as React from 'react';
import dynamic from 'next/dynamic';
import TableChartIcon from '@mui/icons-material/TableChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import { PoliticalParties } from '@components/PoliticalParties';
import { useTranslation } from 'react-i18next';
import VoteChart from '@components/votechart';

// Dynamically import Material-UI components to avoid hydration issues
const Tabs = dynamic(() => import('@mui/material/Tabs'), { ssr: false });
const Tab = dynamic(() => import('@mui/material/Tab'), { ssr: false });
const Box = dynamic(() => import('@mui/material/Box'), { ssr: false });


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ height: '100%', width: '100%', overflowY: 'auto' }}
      {...other}
    >
      {value === index && <Box sx={{ p: 0, height: '100%', width: '100%' }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);
  const { t } = useTranslation();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        color: '#FFFFFF',
        textAlign: 'center'
      }}>
        {t('stats.title')}
      </h2>
      <Box sx={{ 
        width: '100%',
        maxWidth: '500px', 
        minHeight: '350px', // altura mínima cuando hay pocos candidatos
        border: '2px solid #374151',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        justifyContent: 'center',
        margin: '0 auto',
      }}>
        <Box sx={{
          width: '100%',
          borderBottom: '2px solid #374151',
          background: 'rgba(51, 65, 85, 0.2)',
          display: 'flex',
          justifyContent: 'flex-start',
        }}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="tabs example"
            sx={{
              '& .MuiTab-root': {
                color: '#FFFFFF',
                minWidth: 0,
                minHeight: '40px',
                padding: '10px 14px',
                '&.Mui-selected': {
                  color: '#10B981',
                  background: 'rgba(16, 185, 129, 0.08)'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#10B981',
                height: '3px'
              }
            }}
          >
            
            <Tab icon={<TableChartIcon style={{ color: value === 0 ? '#10B981' : '#FFFFFF' }} />} {...a11yProps(0)} />
            
            <Tab icon={<BarChartIcon style={{ color: value === 1 ? '#10B981' : '#FFFFFF' }} />} {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <PoliticalParties />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <VoteChart active={value === 1} />
        </CustomTabPanel>
      </Box>
    </>
  );
}
