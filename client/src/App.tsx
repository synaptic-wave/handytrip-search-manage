import { useState } from "react";
import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import SearchManager from "./components/SearchManager";
import Header from "./components/Header";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#f5f5f5",
    },
  },
});

function App() {
  const [currentPage, setCurrentPage] = useState<"search" | "history">("search");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {currentPage === "search" ? (
          <SearchManager />
        ) : (
          <div>
            <h2>수정 이력</h2>
            <p>이 페이지는 준비 중입니다.</p>
          </div>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
