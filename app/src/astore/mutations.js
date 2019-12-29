export const test = (state, value) => {
  if (state.test !== value) {
    state.test = value;
  }
};

export const UPDATE_SLIDES = (state, value) => {
  if (state.slides !== value) {
    state.slides = value;
  }
};
