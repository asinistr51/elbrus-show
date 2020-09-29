export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return {
        moreDetalisFilm: '',
        films: [1, 2, 3],
        videoUrl: {},
        user: {},
        comments: [],
        news: [],
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.log(err);
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    console.log(err);
  }
};
