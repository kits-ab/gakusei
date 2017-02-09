// import * as WeatherForecasts from './WeatherForecasts';
// import * as Counter from './Counter';
import * as UserStatistics from './UserStatistics';
import * as Security from './Security';

export const reducers = {
  userStatistics: UserStatistics.reducer,
  security: Security.reducer
};

export default {
  reducers() {
    return reducers;
  } // weatherForecasts: WeatherForecasts.reducer
};
