import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

interface Indicator {
    title?: string;
    subtitle?: string;
    value?: string;
}

export default function IndicatorWeather(config: Indicator) {
    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', // Centra el contenido
                justifyContent: 'center',
                textAlign: 'center', // Texto centrado
                borderRadius: 2, // Bordes redondeados
                boxShadow: 3, // Sombra
                backgroundColor: '#1c1c1c', // Fondo oscuro
                color: '#fff', // Texto blanco
            }}
        >
            <Typography 
                component="h2" 
                variant="h6" 
                sx={{
                    color: '#b3b3b3', // Color de título
                    fontWeight: 600,
                }}
                gutterBottom
            >
                {config.title}
            </Typography>
            <Typography 
                component="p" 
                variant="h4" 
                sx={{
                    fontWeight: 700,
                    fontSize: '2rem', // Tamaño grande para el valor
                    color: '#e0e0e0',
                }}
            >
                {config.value}
            </Typography>
            <Box 
                sx={{
                    mt: 1, // Margen superior
                    py: 1, // Espaciado vertical
                    px: 2, // Espaciado horizontal
                    borderRadius: 1,
                    backgroundColor: '#333', // Fondo del subtítulo
                }}
            >
                <Typography 
                    color="text.secondary" 
                    sx={{
                        color: '#9e9e9e', // Color del subtítulo
                        fontSize: '0.875rem', // Tamaño pequeño
                    }}
                >
                    {config.subtitle}
                </Typography>
            </Box>
        </Paper>
    );
}