import React from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';

const App = () => {
    // Example categories and values (to be dynamically populated later)
    const categories = ["Science", "History", "Movies", "Sports", "Tech"];
    const values = [200, 400, 600, 800, 1000];

    return (
        <Box sx={{ padding: 4, backgroundColor: "#282c34", minHeight: "100vh", color: "#fff" }}>
            <Typography variant="h3" align="center" gutterBottom>
                Daily Jeopardy
            </Typography>

            <Grid container spacing={2} justifyContent="center">
                {categories.map((category, rowIndex) => (
                    <Grid item xs={12} key={rowIndex}>
                        <Box display="flex" justifyContent="center" gap={2}>
                            <Paper
                                elevation={4}
                                sx={{
                                    padding: 2,
                                    backgroundColor: "#4a4a4a",
                                    color: "#fff",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    width: 150,
                                }}
                            >
                                {category}
                            </Paper>
                        </Box>
                        <Box display="flex" justifyContent="center" gap={2}>
                            {values.map((value, colIndex) => (
                                <Paper
                                    elevation={4}
                                    key={colIndex}
                                    sx={{
                                        padding: 2,
                                        backgroundColor: "#1e88e5",
                                        color: "#fff",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        width: 150,
                                        cursor: "pointer",
                                        "&:hover": {
                                            backgroundColor: "#1565c0",
                                        },
                                    }}
                                >
                                    ${value}
                                </Paper>
                            ))}
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default App;
