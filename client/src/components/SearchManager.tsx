import { useState } from "react";
import { Box, TextField, Button, Card, CardContent, Typography, Grid, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

interface SearchResult {
  id: number;
  kr_name: string;
  en_name?: string;
}

const SearchManager = () => {
  const [searchType, setSearchType] = useState<"HOTEL" | "ZONE">("HOTEL");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [editName, setEditName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:8038/api/search`, {
        params: {
          type: searchType,
          query: searchQuery,
        },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error("검색 중 오류가 발생했습니다:", error);
      alert("검색 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (result: SearchResult) => {
    setSelectedResult(result);
    setEditName(result.kr_name);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedResult || !editName.trim()) return;

    try {
      await axios.post(`http://localhost:8038/api/histories`, {
        type: searchType,
        name_before: selectedResult.kr_name,
        name_after: editName,
        target_id: selectedResult.id,
        status: "pending",
      });

      setEditDialogOpen(false);
      alert("수정 요청이 등록되었습니다. 승인 후 적용됩니다.");
      handleSearch(); // 목록 새로고침
    } catch (error) {
      console.error("수정 요청 중 오류가 발생했습니다:", error);
      alert("수정 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        검색어 관리
      </Typography>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>검색 타입</InputLabel>
                <Select value={searchType} label="검색 타입" onChange={(e) => setSearchType(e.target.value as "HOTEL" | "ZONE")}>
                  <MenuItem value="HOTEL">호텔</MenuItem>
                  <MenuItem value="ZONE">지역</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField fullWidth label="검색어" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSearch()} />
                <Button variant="contained" onClick={handleSearch} disabled={isLoading} sx={{ minWidth: 100 }}>
                  {isLoading ? "검색 중..." : "검색"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <Grid container spacing={2}>
          {searchResults.map((result) => (
            <Grid item xs={12} sm={6} md={4} key={result.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {result.kr_name}
                  </Typography>
                  {result.en_name && (
                    <Typography color="textSecondary" gutterBottom>
                      {result.en_name}
                    </Typography>
                  )}
                  <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    <IconButton onClick={() => handleEdit(result)} size="small">
                      <EditIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>검색어 수정</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="새 이름" fullWidth value={editName} onChange={(e) => setEditName(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>취소</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SearchManager;
