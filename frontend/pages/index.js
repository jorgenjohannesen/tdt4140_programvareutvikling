import Container from "@mui/material/Container";
import { BACKEND_URL } from "../utils/constants";
import HikeListIndex from "../components/HikeListIndex";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import { Button, Card, TextField, Typography } from "@mui/material";
import FilterCard from "../components/FilterCard";

const Home = ({ hikes }) => {
  const [feedback, setFeedback] = useState(undefined);
  const [severity, setSeverity] = useState(undefined);
  const [filteredHikes, setFilteredHikes] = useState(hikes);

  useEffect(() => {
    if (!filteredHikes || filteredHikes?.length == 0) {
      setSeverity("info");
      setFeedback("Oops! Doesn't look like there are any hikes to display.");
    }
  }, []);

  const useFilter = (textFilter, checkboxFilter) => {
    setSeverity(undefined);
    setFeedback(undefined);

    const newHikeList = hikes.filter((hike) => {
      // Validate text filter
      const fulfilledTextFilter =
        hike.attributes.title
          .toUpperCase()
          .includes(textFilter.toUpperCase()) ||
        hike.attributes.description
          .toUpperCase()
          .includes(textFilter.toUpperCase());

      // Validate difficulty filter
      const fulfilledDifficultyFilter =
        hike.attributes.difficulty === checkboxFilter;

      if (!checkboxFilter || checkboxFilter === "none") {
        if (fulfilledTextFilter) {
          return hike;
        }
      } else {
        if (fulfilledTextFilter && fulfilledDifficultyFilter) {
          return hike;
        }
      }
    });

    setFilteredHikes(newHikeList);

    if (newHikeList.length == 0) {
      setSeverity("info");
      setFeedback("Oops! Doesn't look like there are any hikes to display.");
    }
  };

  return (
    <Container sx={{ mb: 12 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <FilterCard useFilter={useFilter} />
          {feedback && (
            <Alert
              severity={severity}
              sx={{ width: "65%", mx: "auto", my: 2 }}
              data-cy="alert"
            >
              {feedback}
            </Alert>
          )}
          <HikeListIndex hikes={filteredHikes} />
        </Box>
      </Box>
    </Container>
  );
};

export const getServerSideProps = async () => {
  const response = await fetch(`${BACKEND_URL}/api/hikes?populate=*`);
  const result = await response.json();

  const hikes = result.data;

  // Sort hikes such that the most recent hike is first in the array
  if (hikes) {
    hikes.sort(
      (a, b) => -a.attributes.updatedAt.localeCompare(b.attributes.updatedAt)
    );
  }

  return {
    props: {
      hikes,
    },
  };
};

export default Home;
