import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';

import {
  Box,
  Alert,
    Card,
    Grid,
    InputAdornment,
    TextField,
    Typography,
  } from "@mui/material";
  import axios, { API_BASE_URL } from "../api";
  import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const Search = () => {
    const [query, setQuery] = useState("");
    const [post, setPost] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

const handleEdit = (id) => {
  navigate("/edit",{state:{id}});
}

    useEffect(() => {
      const controller = new AbortController();
      const fetchPosts = async () => {
        try {
          setError("");
          const keyword = query.trim();
          const url = keyword.length > 2
            ? `${API_BASE_URL}/jobPosts/keyword/${encodeURIComponent(keyword)}`
            : `${API_BASE_URL}/jobPosts`;
          const response = await axios.get(url, { signal: controller.signal });
          setPost(response.data);
        } catch (err) {
          if (!axios.isCancel(err)) setError("Unable to load jobs. Please try again.");
        }
      };
      fetchPosts();
      return () => controller.abort();
      }, [query]);

      const handleDelete = async (id) => {
        try {
          await axios.delete(`${API_BASE_URL}/jobPost/${id}`);
          setPost((posts) => posts.filter((p) => p.postId !== id));
          setError("");
        } catch (err) {
          setError(err.response?.status === 401
            ? "Please sign in to delete jobs."
            : "Unable to delete this job. Please try again.");
        }
      }

  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container spacing={2} sx={{ margin: "2%" }}>
      <Grid item xs={12} md={12} lg={12}>
      <Box>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            placeholder="Search..."
            sx={{ width: "75%", padding: "2% auto" }}
            fullWidth
            onChange={(e) => setQuery(e.target.value)}
          />
        </Box>
      </Grid>
      {post &&
        post.map((p) => {
          return (
            <Grid key={p.postId} item xs={12} md={6} lg={4}>
              <Card sx={{ padding: "3%", overflow: "hidden", width: "84%", backgroundColor:"#ADD8E6" }}>
                <Typography        
                  variant="h5"
                  sx={{ fontSize: "2rem", fontWeight: "600", fontFamily:"sans-serif" }}
                >
             {p.postProfile}
                </Typography>
                <Typography  sx={{ color: "#585858", marginTop:"2%", fontFamily:"cursive" }} variant="body" >
                  Description: {p.postDesc}
                </Typography>
                <br />
                <br />
                <Typography variant="h6" sx={{ fontFamily:"unset", fontSize:"400"}}>
                  Experience: {p.reqExperience} years
                </Typography>
                <Typography sx={{fontFamily:"serif",fontSize:"400"}} gutterBottom  variant="body">Skills : </Typography>
                {(p.postTechStack || []).map((s, i) => {
                  return (
                    <Typography variant="body" gutterBottom key={i}>
                      {s} .
                      {` `}
                    </Typography>
                  );
                })}
               <DeleteIcon onClick={() => handleDelete(p.postId)} />
                <EditIcon onClick={() => handleEdit(p.postId)} />
              </Card>
            </Grid>
          );
        })}
    </Grid>
    </>
 
  )
}

export default Search
