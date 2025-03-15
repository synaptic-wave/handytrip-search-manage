import { AppBar, Toolbar, Typography, Tabs, Tab } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";

interface HeaderProps {
  currentPage: "search" | "history";
  onPageChange: (page: "search" | "history") => void;
}

const Header = ({ currentPage, onPageChange }: HeaderProps) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          HandyTrip Search Manager
        </Typography>
        <Tabs value={currentPage} onChange={(_, value) => onPageChange(value)} textColor="inherit">
          <Tab value="search" label="검색" icon={<SearchIcon />} iconPosition="start" />
          <Tab value="history" label="수정 이력" icon={<HistoryIcon />} iconPosition="start" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
